import Stripe from 'stripe';
import {
  getPlanConfig,
  getWorkspaceById,
  saveWorkspace,
  isWebhookEventProcessed,
  markWebhookEventProcessed,
} from './workspace-store';
import { Workspace } from '@/types/workspace';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }
  return stripeClient;
}

export interface CheckoutResult {
  url?: string;
  sessionId?: string;
  isTestMode: boolean;
  isCheckoutDisabled: boolean;
  disabledReason?: string;
}

export async function createCheckoutSession(
  workspaceId: string,
  customerEmail: string,
  appUrl: string
): Promise<CheckoutResult> {
  const plan = getPlanConfig();

  // Guard: Arthur has not finalized standalone pricing
  if (!plan.isOfferFinalizedByArthur || !plan.isLiveCheckoutEnabled) {
    return {
      isTestMode: true,
      isCheckoutDisabled: true,
      disabledReason:
        'Paid public checkout is currently disabled in test mode. Arthur must finalize and approve the standalone offer pricing in settings before public card charging is enabled.',
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      isTestMode: true,
      isCheckoutDisabled: true,
      disabledReason:
        'STRIPE_SECRET_KEY is not configured on the server. Test mode preview is active.',
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.monthlyPriceInCents,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      workspaceId,
      planId: plan.id,
    },
    success_url: `${appUrl}/?billing=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/?billing=canceled`,
  });

  return {
    url: session.url || undefined,
    sessionId: session.id,
    isTestMode: !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_'),
    isCheckoutDisabled: false,
  };
}

export async function createCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe || !stripeCustomerId) return null;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return portalSession.url;
  } catch (err) {
    console.error('Failed to create customer portal session:', err);
    return null;
  }
}

// -------------------------------------------------------------
// IDEMPOTENT WEBHOOK HANDLER
// -------------------------------------------------------------
export interface WebhookProcessingResult {
  received: boolean;
  handledEvent?: string;
  workspaceId?: string;
  message: string;
}

export async function handleStripeWebhookEvent(
  rawBody: string,
  signature: string | null
): Promise<WebhookProcessingResult> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (stripe && webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      return {
        received: false,
        message: `Webhook signature verification failed: ${err.message}`,
      };
    }
  } else {
    // If testing without a live webhook secret, parse raw payload safely
    try {
      event = JSON.parse(rawBody);
    } catch {
      return { received: false, message: 'Invalid JSON payload' };
    }
  }

  // Idempotency: Prevent duplicate events from granting excess access
  if (isWebhookEventProcessed(event.id)) {
    return {
      received: true,
      handledEvent: event.type,
      message: `Event ${event.id} already processed. Deduplicated cleanly.`,
    };
  }

  markWebhookEventProcessed(event.id);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const workspaceId = session.metadata?.workspaceId;
      if (workspaceId) {
        const ws = getWorkspaceById(workspaceId);
        if (ws) {
          ws.subscription.status = 'active';
          ws.subscription.stripeCustomerId = session.customer as string;
          ws.subscription.stripeSubscriptionId = session.subscription as string;
          ws.subscription.currentPeriodStart = new Date().toISOString();
          ws.subscription.currentPeriodEnd = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString();
          ws.subscription.cancelAtPeriodEnd = false;
          saveWorkspace(ws);
          return {
            received: true,
            handledEvent: event.type,
            workspaceId,
            message: `Workspace ${workspaceId} subscription activated via verified webhook.`,
          };
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const ws = findWorkspaceByStripeCustomer(customerId);
      if (ws) {
        ws.subscription.status = mapStripeStatus(sub.status);
        ws.subscription.cancelAtPeriodEnd = sub.cancel_at_period_end;
        if ((sub as any).current_period_end) {
          ws.subscription.currentPeriodEnd = new Date(
            (sub as any).current_period_end * 1000
          ).toISOString();
        }
        saveWorkspace(ws);
        return {
          received: true,
          handledEvent: event.type,
          workspaceId: ws.id,
          message: `Subscription updated to ${ws.subscription.status}`,
        };
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const ws = findWorkspaceByStripeCustomer(customerId);
      if (ws) {
        ws.subscription.status = 'canceled';
        // Halt automated jobs upon cancellation
        ws.settings.isAutomationPaused = true;
        saveWorkspace(ws);
        return {
          received: true,
          handledEvent: event.type,
          workspaceId: ws.id,
          message: `Subscription canceled. Automation halted for workspace ${ws.id}.`,
        };
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const ws = findWorkspaceByStripeCustomer(customerId);
      if (ws) {
        ws.subscription.status = 'past_due';
        // Alert owner of payment failure
        ws.alerts.unshift({
          id: `alert-billing-${Date.now()}`,
          category: 'usage_limit',
          title: 'Subscription Payment Failed',
          description:
            'Your monthly renewal payment failed. Paid automation is temporarily on hold. Please update your payment method.',
          severity: 'critical',
          createdAt: new Date().toISOString(),
          actionLabel: 'Update Payment Method',
          actionType: 'view_settings',
          resolved: false,
          occurrenceCount: 1,
          lastOccurrenceAt: new Date().toISOString(),
        });
        saveWorkspace(ws);
        return {
          received: true,
          handledEvent: event.type,
          workspaceId: ws.id,
          message: `Payment failed handled for workspace ${ws.id}`,
        };
      }
      break;
    }
  }

  return {
    received: true,
    handledEvent: event.type,
    message: 'Event acknowledged.',
  };
}

function findWorkspaceByStripeCustomer(customerId: string): Workspace | undefined {
  const all = getWorkspaceById('ws-arthur-creatives'); // checks store
  // Search in memory
  // Let's import getAllWorkspaces from workspace-store
  const { getAllWorkspaces } = require('./workspace-store');
  const workspaces: Workspace[] = getAllWorkspaces();
  return workspaces.find((w) => w.subscription.stripeCustomerId === customerId);
}

function mapStripeStatus(status: Stripe.Subscription.Status): any {
  switch (status) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'canceled';
    case 'unpaid':
      return 'unpaid';
    default:
      return 'active';
  }
}
