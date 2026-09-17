import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { getPlanConfig, updatePlanConfig } from '@/lib/workspace-store';

export async function GET(req: NextRequest) {
  const plan = getPlanConfig();
  return NextResponse.json({ plan });
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
