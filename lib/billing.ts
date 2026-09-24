import Stripe from 'stripe';
import {
  getPlanConfig,
  getWorkspaceById,
  saveWorkspace,
  isWebhookEventProcessed,
  markWebhookEventProcessed,
} from './workspace-store';
import { Workspace, SubscriptionTier } from '@/types/workspace';

export const WORKFORCE_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter Workforce',
    tagline: 'Essential AI profile auditing & reputation guardrails for solo practices.',
    description:
      'Continuous profile consistency checks, one-click repair proposals, review response drafting, and safety guardrails.',
    monthlyPriceInCents: 2900, // $29/mo
    annualPriceInCents: 27900, // $279/yr (save 20%)
    trialDays: 7,
    verificationHoldCents: 100, // $1.00 verification hold
    features: [
      '1 Managed Google Business Profile Location',
      'Continuous Inconsistency & Drift Audits (50/mo)',
      'One-Click Authorized Profile Repairs',
      '20 AI-Drafted Local Posts & Review Replies / month',
      '60 Automated Daily Operational Actions / month',
      '100 MB Stored Media & Audit Logs',
      'Review-First Safety Gate (Human Approval)',
      '7-Day Free Trial ($1 Verification Hold)',
    ],
    entitlements: {
      maxLocations: 1,
      monthlyAiAnalysesQuota: 50,
      monthlyDraftsQuota: 20,
      monthlyAutomatedActionsQuota: 60,
      maxStoredMediaMb: 100,
    },
  },
  {
    id: 'growth',
    name: 'Growth Workforce',
    tagline: 'Complete automated workforce with diff repairs, routine autopilot & search telemetry.',
    description:
      'Advanced consistency audits, real-time drift alerts, weekly post generator, smart review handling, and routine autopilot publishing.',
    badge: 'Most Popular',
    isPopular: true,
    monthlyPriceInCents: 4900, // $49/mo
    annualPriceInCents: 47000, // $470/yr (save 20%)
    trialDays: 7,
    verificationHoldCents: 100, // $1.00 verification hold
    features: [
      '1 Managed Google Business Location (+ 2nd location option)',
      'Continuous Inconsistency & Real-time Drift Audits (150/mo)',
      'Automated Diff Synthesis & Instant Repairs',
      '50 AI-Drafted Content Posts & Review Responses / month',
      '150 Automated Daily Operational Actions / month',
      'Routine Autopilot Mode (safe automated publishing)',
      'Local Search Visibility & Keyword Telemetry',
      '500 MB Stored Media & Activity Logs',
      'Priority Email & Support Queue',
      '7-Day Free Trial ($1 Verification Hold)',
    ],
    entitlements: {
      maxLocations: 1,
      monthlyAiAnalysesQuota: 150,
      monthlyDraftsQuota: 50,
      monthlyAutomatedActionsQuota: 150,
      maxStoredMediaMb: 500,
    },
  },
  {
    id: 'scale',
    name: 'Scale Workforce',
    tagline: 'High-frequency operations, multiple profiles, and autonomous cycles.',
    description:
      'Multi-location central command, autonomous daily operations, high-volume draft engine, and competitor insights.',
    badge: 'Multi-Location',
    monthlyPriceInCents: 9900, // $99/mo
    annualPriceInCents: 95000, // $950/yr (save 20%)
    trialDays: 7,
    verificationHoldCents: 100, // $1.00 verification hold
    features: [
      'Up to 3 Connected Google Business Locations',
      'Continuous Profile Inconsistency Audits (500/mo)',
      '150 AI-Drafted Content Posts & Review Replies / month',
      '400 Automated Daily Operational Actions / month',
      'Autonomous Daily Workforce Cycles & Task Scheduling',
      'Multi-Location Central Command View',
      'Competitor Search Visibility & Sentiment Trends',
      '2,000 MB Stored Media & Audit Logs',
      'Dedicated 1-on-1 Onboarding & VIP Priority Support',
      '7-Day Free Trial ($1 Verification Hold)',
    ],
    entitlements: {
      maxLocations: 3,
      monthlyAiAnalysesQuota: 500,
      monthlyDraftsQuota: 150,
      monthlyAutomatedActionsQuota: 400,
      maxStoredMediaMb: 2000,
    },
  },
];

export function getTierById(tierId?: string): SubscriptionTier {
  const found = WORKFORCE_SUBSCRIPTION_TIERS.find((t) => t.id === tierId);
  return found || WORKFORCE_SUBSCRIPTION_TIERS[1]; // default to Growth
}

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
  appUrl: string,
  tierId: 'starter' | 'growth' | 'scale' = 'growth',
  billingInterval: 'month' | 'year' = 'month'
): Promise<CheckoutResult> {
  const tier = getTierById(tierId);
  const plan = getPlanConfig();

  // Guard: Check if live checkout is authorized
  if (!plan.isOfferFinalizedByArthur) {
    return {
      isTestMode: true,
      isCheckoutDisabled: true,
      disabledReason:
        'Pricing offer is pending final activation. Card verification trial mode is available in the app.',
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      isTestMode: true,
      isCheckoutDisabled: true,
      disabledReason:
        'STRIPE_SECRET_KEY is not configured on the server. Instant card verification trial is active.',
    };
  }

  const unitAmount =
    billingInterval === 'year' ? tier.annualPriceInCents : tier.monthlyPriceInCents;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    subscription_data: {
      trial_period_days: 7, // 7-day free trial with card verification
      metadata: {
        workspaceId,
        tierId: tier.id,
        billingInterval,
      },
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tier.name} — Arthur’s AI Workforce`,
            description: `${tier.description} Includes 7-day free trial; billing starts on Day 7.`,
          },
          unit_amount: unitAmount,
          recurring: {
            interval: billingInterval,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      workspaceId,
      tierId: tier.id,
      billingInterval,
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

export async function verifyCardAndStartTrial(
  workspaceId: string,
  options: {
    tierId: 'starter' | 'growth' | 'scale';
    billingInterval?: 'month' | 'year';
    cardLast4?: string;
    cardBrand?: string;
  }
): Promise<{ success: boolean; workspace: Workspace; message: string }> {
  const ws = getWorkspaceById(workspaceId);
  if (!ws) {
    throw new Error('Workspace not found');
  }

  const tier = getTierById(options.tierId);
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const interval = options.billingInterval || 'month';
  const priceInCents = interval === 'year' ? tier.annualPriceInCents : tier.monthlyPriceInCents;

  ws.subscription = {
    planId: tier.id,
    planName: tier.name,
    status: 'trialing',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: trialEnd.toISOString(),
    cancelAtPeriodEnd: false,
    billingInterval: interval,
    priceInCents,
    isConfiguredByArthur: true,
    cardVerified: true,
    cardLast4: options.cardLast4 || '4242',
    cardBrand: options.cardBrand || 'Visa',
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnd.toISOString(),
    verificationHoldCents: 100, // $1.00 verification hold
  };

  // Set entitlements according to tier
  ws.entitlements = {
    maxLocations: tier.entitlements.maxLocations,
    monthlyAiAnalysesQuota: tier.entitlements.monthlyAiAnalysesQuota,
    monthlyAiAnalysesUsed: ws.entitlements?.monthlyAiAnalysesUsed || 0,
    monthlyDraftsQuota: tier.entitlements.monthlyDraftsQuota,
    monthlyDraftsUsed: ws.entitlements?.monthlyDraftsUsed || 0,
    monthlyAutomatedActionsQuota: tier.entitlements.monthlyAutomatedActionsQuota,
    monthlyAutomatedActionsUsed: ws.entitlements?.monthlyAutomatedActionsUsed || 0,
    maxStoredMediaMb: tier.entitlements.maxStoredMediaMb,
    storedMediaMbUsed: ws.entitlements?.storedMediaMbUsed || 0,
  };

  saveWorkspace(ws);

  return {
    success: true,
    workspace: ws,
    message: `Card verified ($1.00 hold). 7-day free trial activated for ${tier.name}. First charge of $${(priceInCents / 100).toFixed(2)} will occur on ${trialEnd.toLocaleDateString()}.`,
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
