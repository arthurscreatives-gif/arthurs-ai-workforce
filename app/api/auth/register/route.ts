import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  createSession,
  sanitizeInput,
} from '@/lib/auth-session';
import {
  getUserByEmail,
  saveUser,
  saveWorkspace,
  getPlanConfig,
} from '@/lib/workspace-store';
import { User, Workspace } from '@/types/workspace';
import {
  defaultApprovedBusinessFacts,
  defaultLiveGoogleProfile,
  defaultSettings,
  defaultTodaysWork,
} from '@/lib/default-data';

export async function POST(req: NextRequest) {
  // Rate limit: 5 registration requests per minute per IP
  const ip = req.headers.get('x-forwarded-for') || 'anon-register';
  const rate = checkRateLimit(`register_${ip}`, 5, 60);
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
      emailVerified: true, // Auto-verified in prototype with verification record
      verificationCode,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    saveUser(newUser);

    const plan = getPlanConfig();
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Build dedicated customer workspace
    const newWorkspace: Workspace = {
      id: workspaceId,
      userId: newUser.id,
      name: `${businessName} Workspace`,
      businessName,
      locationId: `locations/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      connectionStatus: 'awaiting_google_access',
      googleConnection: {
        status: 'sandbox_preview',
        projectModel: 'central_verified',
        authorizedEmail: email,
        readOnlyReason:
          'Google Business Profile API Partner Verification Pending. Safe draft & inspection mode active.',
      },

      subscription: {
        planId: plan.id,
        planName: plan.name,
        status: 'trialing',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14-day trial
        cancelAtPeriodEnd: false,
        billingInterval: 'month',
        priceInCents: plan.monthlyPriceInCents,
        isConfiguredByArthur: plan.isOfferFinalizedByArthur,
      },

      entitlements: {
        maxLocations: 1,
        monthlyAiAnalysesQuota: plan.entitlements.monthlyAiAnalysesQuota,
        monthlyAiAnalysesUsed: 0,
        monthlyDraftsQuota: plan.entitlements.monthlyDraftsQuota,
        monthlyDraftsUsed: 0,
        monthlyAutomatedActionsQuota: plan.entitlements.monthlyAutomatedActionsQuota,
        monthlyAutomatedActionsUsed: 0,
        maxStoredMediaMb: plan.entitlements.maxStoredMediaMb,
        storedMediaMbUsed: 0,
      },

      approvedFacts: {
        ...defaultApprovedBusinessFacts,
        businessName,
        phoneNumber: '(555) 000-0000',
        websiteUri: `https://${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        description: `${businessName} provides specialized local services with a commitment to quality and customer satisfaction.`,
        lastConfirmedAt: 'Pending Initial Onboarding Verification',
      },

      liveProfile: {
        ...defaultLiveGoogleProfile,
        title: businessName,
        profileDescription: `${businessName} provides specialized local services with a commitment to quality.`,
        lastGoogleSyncAt: 'Pending First Google Connection',
      },

      // Strictly review_first by default for all new customers
      settings: {
        ...defaultSettings,
        ownerEmail: email,
        automationMode: 'review_first',
        isAutomationPaused: false,
        allowedAutopilotActions: [],
      },

      findings: [],
      repairProposals: [],
      searchInsights: {
        reportingPeriod: 'Last 30 Days (Awaiting Sync)',
        lastSyncAt: 'Not synced yet',
        reportingDelayNotice: 'Google Search Console and Maps metrics typically update within 48 hours of profile connection.',
        impressionsSearch: 0,
        impressionsMaps: 0,
        callClicks: 0,
        websiteClicks: 0,
        directionRequests: 0,
        comparison: {
          priorPeriodLabel: 'Prior 30 days',
          impressionsChangePercent: 0,
          websiteClicksChangePercent: 0,
          callClicksChangePercent: 0,
        },
        topSearchQueries: [],
      },
      drafts: [],
      reviews: [],
      taskQueue: [],
      alerts: [
        {
          id: `alert-welcome-${Date.now()}`,
          category: 'google_reconnection',
          title: 'Welcome to Arthur’s AI Workforce',
          description:
            'Complete your guided onboarding to connect your Google Business Profile and run your first consistency audit.',
          severity: 'info',
          createdAt: new Date().toISOString(),
          actionLabel: 'Complete Setup',
          actionType: 'open_connect',
          resolved: false,
          occurrenceCount: 1,
          lastOccurrenceAt: new Date().toISOString(),
        },
      ],
      todaysWork: {
        ...defaultTodaysWork,
        date: new Date().toISOString().split('T')[0],
        checkedItems: [],
        changedAndVerified: [],
        publishedItems: [],
        needsApprovalItems: [],
        blockedOrFailedItems: [],
        totalTasksExecuted: 0,
      },
      logs: [
        {
          id: `act-reg-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
          action: 'Account & Workspace Created',
          details: `Workspace "${businessName}" registered by ${fullName} (${email}). Initial safety mode: Review First.`,
          authorization: 'owner_manual_approval',
          result: 'success',
        },
      ],
      isSuspended: false,
    };

    saveWorkspace(newWorkspace);

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
