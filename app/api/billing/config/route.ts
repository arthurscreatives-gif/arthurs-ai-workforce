import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { getPlanConfig, updatePlanConfig } from '@/lib/workspace-store';
import { WORKFORCE_SUBSCRIPTION_TIERS } from '@/lib/billing';

export async function GET(req: NextRequest) {
  const plan = getPlanConfig();
  return NextResponse.json({
    plan,
    tiers: WORKFORCE_SUBSCRIPTION_TIERS,
    trialConfig: {
      trialDays: 7,
      verificationHoldCents: 100, // $1 verification hold
      currency: 'USD',
      description:
        '7-day free trial with $1 credit card verification hold. Card is charged after 7 days.',
    },
  });
}

// Only Arthur (owner) can configure the standalone subscription plan offer
export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth || auth.user.role !== 'owner') {
    return NextResponse.json(
      { error: 'Only Arthur (platform owner) can configure subscription pricing.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const updated = updatePlanConfig(body);
    return NextResponse.json({ success: true, plan: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update plan configuration' }, { status: 400 });
  }
}
