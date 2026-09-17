import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth, destroySession } from '@/lib/auth-session';
import {
  getWorkspacesByUserId,
  sanitizeWorkspaceForClient,
} from '@/lib/workspace-store';

export async function GET(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { user, workspace } = auth;
  const userWorkspaces = getWorkspacesByUserId(user.id);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    workspace: sanitizeWorkspaceForClient(workspace, user.role),
    availableWorkspaces: userWorkspaces.map((w) => ({
      id: w.id,
      name: w.name,
      businessName: w.businessName,
      role: w.role,
      status: w.subscription.status,
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (auth?.token) {
    destroySession(auth.token);
  }

  const res = NextResponse.json({ success: true, message: 'Signed out.' });
  res.cookies.set('arthur_session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  return res;
}
