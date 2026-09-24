import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createSession, sanitizeInput } from '@/lib/auth-session';
import {
  getUserByEmail,
  getWorkspacesByUserId,
  saveUser,
  createWorkspaceForUser,
} from '@/lib/workspace-store';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon-login';
  const rate = checkRateLimit(`login_${ip}`, 15, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many sign-in attempts. Please wait ${rate.resetSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = sanitizeInput(body.email?.toLowerCase());

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    let user = getUserByEmail(email);
    let activeWorkspace;

    if (!user) {
      // Auto-provision fresh account and clean zero-data workspace for friction-free access
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = {
        id: userId,
        email,
        fullName: formattedName,
        role: 'customer',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      saveUser(user);

      activeWorkspace = createWorkspaceForUser({
        userId: user.id,
        userEmail: email,
        businessName: `${formattedName}'s Business`,
        role: 'customer',
        planId: 'starter',
        planName: 'Starter AI Workforce',
        priceInCents: 4900,
      });
    } else {
      user.lastLoginAt = new Date().toISOString();
      saveUser(user);

      const userWorkspaces = getWorkspacesByUserId(user.id);
      activeWorkspace = userWorkspaces[0];

      if (!activeWorkspace) {
        activeWorkspace = createWorkspaceForUser({
          userId: user.id,
          userEmail: email,
          businessName: `${user.fullName}'s Business`,
          role: user.role,
        });
      }
    }

    const token = createSession(user.id, activeWorkspace.id);
    const userWorkspaces = getWorkspacesByUserId(user.id);

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      workspace: activeWorkspace,
      availableWorkspaces: userWorkspaces.map((w) => ({
        id: w.id,
        name: w.name,
        businessName: w.businessName,
        role: w.role,
      })),
    });

    res.cookies.set('arthur_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to sign in.' }, { status: 500 });
  }
}
