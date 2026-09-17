import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { createCustomerPortalSession } from '@/lib/billing';

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { workspace } = auth;
  const stripeCustomerId = workspace.subscription.stripeCustomerId;

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'No active Stripe customer billing profile attached to this workspace.' },
      { status: 400 }
    );
  }

  const returnUrl = `${process.env.APP_URL || req.nextUrl.origin}/`;
  const url = await createCustomerPortalSession(stripeCustomerId, returnUrl);

  if (!url) {
    return NextResponse.json(
      { error: 'Failed to generate Stripe Customer Portal session. Check Stripe configuration.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url });
}
