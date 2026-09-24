import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  createSession,
  sanitizeInput,
} from '@/lib/auth-session';
import {
  getUserByEmail,
  saveUser,
  createWorkspaceForUser,
} from '@/lib/workspace-store';
import { User } from '@/types/workspace';

const PLAN_PRESETS: Record<string, { name: string; price: number }> = {
  starter: { name: 'Starter AI Workforce', price: 4900 },
  growth: { name: 'Growth AI Workforce', price: 9900 },
  enterprise: { name: 'Enterprise AI Workforce', price: 19900 },
};

export async function POST(req: NextRequest) {
  // Rate limit: 10 registration requests per minute per IP
  const ip = req.headers.get('x-forwarded-for') || 'anon-register';
  const rate = checkRateLimit(`register_${ip}`, 10, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many registration attempts. Please wait ${rate.resetSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = sanitizeInput(body.email?.toLowerCase());
    const fullName = sanitizeInput(body.fullName);
    const businessName = sanitizeInput(body.businessName);
    const selectedPlanId = body.planId || 'starter';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }
    if (!businessName || businessName.length < 2) {
      return NextResponse.json({ error: 'Please provide your business name.' }, { status: 400 });
    }

    // Check if user already exists
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: User = {
      id: userId,
      email,
      fullName,
      role: 'customer',
      emailVerified: true,
      verificationCode,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    saveUser(newUser);

    const planInfo = PLAN_PRESETS[selectedPlanId] || PLAN_PRESETS.starter;

    // Create a pristine, isolated workspace with zero mock data
    const newWorkspace = createWorkspaceForUser({
      userId: newUser.id,
      userEmail: email,
      businessName,
      role: 'customer',
      planId: selectedPlanId,
      planName: planInfo.name,
      priceInCents: planInfo.price,
    });

    // Create session token
    const token = createSession(newUser.id, newWorkspace.id);

    const res = NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      },
      workspace: newWorkspace,
    });

    res.cookies.set('arthur_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60,
      path: '/',
    });

    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
