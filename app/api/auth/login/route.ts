import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createSession, sanitizeInput } from '@/lib/auth-session';
import { getUserByEmail, getWorkspacesByUserId, saveUser } from '@/lib/workspace-store';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon-login';
  const rate = checkRateLimit(`login_${ip}`, 10, 60);
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
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please check your spelling or register.' },
        { status: 404 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    saveUser(user);

    // Get active workspace for user
    const userWorkspaces = getWorkspacesByUserId(user.id);
    const activeWorkspace = userWorkspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json({ error: 'No workspace assigned to user.' }, { status: 404 });
    }

    const token = createSession(user.id, activeWorkspace.id);

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
