import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { createCheckoutSession } from '@/lib/billing';

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user, workspace } = auth;
  const appUrl = process.env.APP_URL || req.nextUrl.origin;

  try {
    const result = await createCheckoutSession(workspace.id, user.email, appUrl);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initiate checkout session' },
      { status: 500 }
    );
  }
}
