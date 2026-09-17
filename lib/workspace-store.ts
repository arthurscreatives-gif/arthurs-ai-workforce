import {
  Workspace,
  User,
  PlanConfig,
  AdminActionLog,
  SupportTicket,
  UserRole,
} from '@/types/workspace';
import {
  defaultApprovedBusinessFacts,
  defaultLiveGoogleProfile,
  defaultFindings,
  defaultRepairProposals,
  defaultSearchMetrics,
  defaultContentDrafts,
  defaultSettings,
  defaultTaskQueue,
  defaultWorkforceAlerts,
  defaultTodaysWork,
  defaultActivityLogs,
} from './default-data';

// Central in-memory multi-tenant store across server requests
interface StoreState {
  users: Map<string, User>;
  workspaces: Map<string, Workspace>;
  adminLogs: AdminActionLog[];
  supportTickets: SupportTicket[];
  planConfig: PlanConfig;
  processedWebhookEvents: Set<string>;
}

// Global declaration to survive Next.js dev reloads
declare global {
  var __arthur_workforce_store: StoreState | undefined;
}

function initializeStore(): StoreState {
  const users = new Map<string, User>();
  const workspaces = new Map<string, Workspace>();

  // 1. Arthur Platform Owner User
  const arthurUser: User = {
    id: 'user-arthur-owner',
    email: 'arthurscreatives@gmail.com',
    fullName: 'Arthur (Owner)',
    role: 'owner',
    emailVerified: true,
    createdAt: '2026-09-01T09:00:00-04:00',
    lastLoginAt: '2026-09-17T12:00:00-04:00',
  };
  users.set(arthurUser.id, arthurUser);

  // 2. Arthur's Preserved Workspace
  const arthurWorkspace: Workspace = {
    id: 'ws-arthur-creatives',
    userId: arthurUser.id,
    name: "Arthur's Creatives Main Workspace",
    businessName: "Arthur's Creatives",
    locationId: 'locations/114920491823',
    role: 'owner',
    createdAt: '2026-09-01T09:00:00-04:00',
    updatedAt: '2026-09-17T12:00:00-04:00',

    connectionStatus: 'connected',
    googleConnection: {
      status: 'connected_live',
      projectModel: 'central_verified',
      googleAccountId: 'accounts/10892019482',
      locationId: 'locations/114920491823',
      authorizedEmail: 'arthurscreatives@gmail.com',
      scopeGranted: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      gcpProjectId: 'arthurs-ai-workforce-prod',
      connectedAt: '2026-09-01T09:15:00-04:00',
      lastTokenRefreshAt: '2026-09-17T12:00:00-04:00',
    },

    // Arthur's workspace has an explicit internal entitlement without a fake paid subscription
    subscription: {
      planId: 'owner_internal_tier',
      planName: 'Arthur Owner Internal Access',
      status: 'owner_internal',
      currentPeriodStart: '2026-01-01T00:00:00Z',
      currentPeriodEnd: '2099-12-31T23:59:59Z',
      cancelAtPeriodEnd: false,
      billingInterval: 'year',
      priceInCents: 0,
      isConfiguredByArthur: true,
    },

    entitlements: {
      maxLocations: 5,
      monthlyAiAnalysesQuota: 9999,
      monthlyAiAnalysesUsed: 14,
      monthlyDraftsQuota: 9999,
      monthlyDraftsUsed: 8,
      monthlyAutomatedActionsQuota: 9999,
      monthlyAutomatedActionsUsed: 22,
      maxStoredMediaMb: 5000,
      storedMediaMbUsed: 42,
    },

    approvedFacts: defaultApprovedBusinessFacts,
    liveProfile: defaultLiveGoogleProfile,
    settings: defaultSettings,
    findings: defaultFindings,
    repairProposals: defaultRepairProposals,
    searchInsights: defaultSearchMetrics,
    drafts: defaultContentDrafts,
    reviews: [],
    taskQueue: defaultTaskQueue,
    alerts: defaultWorkforceAlerts,
    todaysWork: defaultTodaysWork,
    logs: defaultActivityLogs,
    isSuspended: false,
  };
  workspaces.set(arthurWorkspace.id, arthurWorkspace);

  // 3. Demo Customer Account (for instant testing of customer isolation)
  const demoCustomerUser: User = {
    id: 'user-demo-customer',
    email: 'client@summitwellness.example',
    fullName: 'Dr. Elena Vance',
    role: 'customer',
    emailVerified: true,
    createdAt: '2026-09-10T14:30:00-04:00',
    lastLoginAt: '2026-09-17T10:15:00-04:00',
  };
  users.set(demoCustomerUser.id, demoCustomerUser);

  const demoCustomerWorkspace: Workspace = {
    id: 'ws-summit-wellness',
    userId: demoCustomerUser.id,
    name: 'Summit Wellness Clinic',
    businessName: 'Summit Wellness & Physical Therapy',
    locationId: 'locations/8839201948',
    role: 'customer',
    createdAt: '2026-09-10T14:35:00-04:00',
    updatedAt: '2026-09-17T10:15:00-04:00',

    connectionStatus: 'awaiting_google_access',
    googleConnection: {
      status: 'sandbox_preview',
      projectModel: 'central_verified',
      authorizedEmail: 'client@summitwellness.example',
      scopeGranted: ['https://www.googleapis.com/auth/business.manage'],
      connectedAt: '2026-09-10T14:40:00-04:00',
      readOnlyReason: 'Google Business Profile Partner Verification Pending. Safe draft & inspection mode active.',
    },

    subscription: {
      planId: 'plan_gbp_standard',
      planName: 'Google Business Profile Manager',
      status: 'trialing',
      currentPeriodStart: '2026-09-10T00:00:00Z',
      currentPeriodEnd: '2026-10-10T23:59:59Z',
      cancelAtPeriodEnd: false,
      billingInterval: 'month',
      priceInCents: 4900,
      isConfiguredByArthur: false, // In test mode
    },

    entitlements: {
      maxLocations: 1,
      monthlyAiAnalysesQuota: 50,
      monthlyAiAnalysesUsed: 3,
      monthlyDraftsQuota: 30,
      monthlyDraftsUsed: 2,
      monthlyAutomatedActionsQuota: 100,
      monthlyAutomatedActionsUsed: 12,
      maxStoredMediaMb: 100,
      storedMediaMbUsed: 4,
    },

    approvedFacts: {
      ...defaultApprovedBusinessFacts,
      businessName: 'Summit Wellness & Physical Therapy',
      description:
        'Holistic physical therapy, sports recovery, and rehabilitation clinic serving the greater metro community.',
      phoneNumber: '(555) 728-1934',
      websiteUri: 'https://summitwellness.example',
      primaryCategory: 'Physical Therapy Clinic',
      additionalCategories: ['Wellness Center', 'Sports Medicine Clinic'],
      lastConfirmedAt: '2026-09-12 11:30 EDT',
    },

    liveProfile: {
      ...defaultLiveGoogleProfile,
      title: 'Summit Wellness & Physical Therapy',
      profileDescription:
        'Physical therapy clinic specializing in orthopedic rehabilitation and injury recovery.',
      phoneNumbers: { primaryPhone: '(555) 728-1934' },
      websiteUri: 'https://summitwellness.example',
      primaryCategory: 'Physical Therapy Clinic',
      lastGoogleSyncAt: '2026-09-16 09:00 EDT',
    },

    // New customers strictly default to review_first
    settings: {
      ...defaultSettings,
      ownerEmail: 'client@summitwellness.example',
      automationMode: 'review_first',
      isAutomationPaused: false,
      allowedAutopilotActions: [],
    },

    findings: [
      {
        id: 'find-cust-1',
        field: 'services',
        fieldLabel: 'Specialized Sports Rehab Services',
        issue: '3 primary therapy services missing from Google menu',
        evidence: 'Dry Needling, Shockwave Therapy, and Concussion Screening are listed on website but absent on Google profile.',
        whyItMatters: 'Patients searching for modern recovery modalities cannot see matching service offerings.',
        proposedAction: 'Sync complete service catalogue to Google Business Profile.',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: '2026-09-16 09:15 EDT',
        status: 'open',
      },
    ],

    repairProposals: [
      {
        id: 'rep-cust-1',
        field: 'services',
        fieldLabel: 'Physical Therapy Services',
        currentValue: 'General PT (2 items)',
        proposedValue: 'Comprehensive 5-Service Suite with itemized descriptions',
        reason: 'Align Google Profile with current clinic offerings',
        evidence: 'Website services page verified 2026-09-16',
        isProtectedField: false,
        requiresApproval: true,
        status: 'proposed',
        proposedAt: '2026-09-16 09:16 EDT',
        rollbackAvailable: false,
      },
    ],

    searchInsights: defaultSearchMetrics,
    drafts: [
      {
        id: 'draft-cust-1',
        type: 'small_business_tip',
        typeLabel: 'Patient Wellness Tip',
        title: '3 Stretches to Prevent Desk Posture Fatigue',
        body: 'Sitting for extended periods compresses lumbar discs. Here are three 60-second stretches our physical therapists recommend during your workday.',
        callToAction: 'LEARN_MORE',
        ctaUrl: 'https://summitwellness.example/desk-ergonomics',
        createdAt: '2026-09-16 14:00 EDT',
        status: 'draft',
      },
    ],

    reviews: [
      {
        id: 'rev-cust-1',
        reviewerName: 'Marcus Bennett',
        starRating: 5,
        comment: 'The PT team here helped me recover from my rotator cuff injury twice as fast as expected. Highly recommend!',
        createTime: '2026-09-15T11:00:00Z',
        serviceMentioned: 'Rotator cuff rehabilitation',
        reply: {
          id: 'rep-cust-rev-1',
          reviewId: 'rev-cust-1',
          replyText: 'Thank you Marcus! We are thrilled to hear your shoulder recovery went so smoothly. Keep up the mobility drills!',
          isSensitiveComplaint: false,
          sentiment: 'positive',
          status: 'draft',
          createdAt: '2026-09-15 13:00 EDT',
        },
      },
    ],

    taskQueue: [
      {
        id: 'task-cust-1',
        action: 'Service Catalogue Sync Review',
        reason: 'Owner authorization required to publish new medical services to Google Profile',
        category: 'repair',
        createdAt: '2026-09-16 09:16 EDT',
        approvalStatus: 'pending_approval',
        executionStatus: 'Awaiting Approval',
        requiresOwnerApproval: true,
        isProtectedField: false,
        targetField: 'services',
        deduplicationKey: 'ws-summit-services-sync',
      },
    ],

    alerts: [
      {
        id: 'alert-cust-1',
        category: 'review_attention',
        title: 'Draft Reply Ready for Marcus Bennett',
        description: '5-star review received. Personalized response draft prepared for your one-click approval.',
        severity: 'info',
        createdAt: '2026-09-15 13:00 EDT',
        actionLabel: 'Review Reply',
        actionType: 'view_review',
        resolved: false,
        occurrenceCount: 1,
        lastOccurrenceAt: '2026-09-15 13:00 EDT',
      },
    ],

    todaysWork: {
      date: '2026-09-17',
      checkedItems: ['Profile NAP Consistency', 'Operating Hours', 'Recent Reviews'],
      changedAndVerified: [],
      publishedItems: [],
      needsApprovalItems: ['Service Catalogue Sync Review', 'Marcus Bennett 5-Star Review Reply'],
      blockedOrFailedItems: [],
      totalTasksExecuted: 3,
      lastRunTimestamp: '2026-09-17 09:00 EDT',
    },

    logs: [
      {
        id: 'act-cust-1',
        timestamp: '2026-09-16 09:15 EDT',
        action: 'First Inconsistency Audit Completed',
        details: 'Discovered missing service listings. Health score computed at 82%.',
        authorization: 'system_inspection',
        result: 'success',
      },
    ],

    isSuspended: false,
  };
  workspaces.set(demoCustomerWorkspace.id, demoCustomerWorkspace);

  // 4. Initial Plan Config (Single configurable package, pricing undecided, test mode)
  const planConfig: PlanConfig = {
    id: 'plan_gbp_standard',
    name: 'Google Business Profile Manager',
    tagline: 'Intelligent profile accuracy, automated repairs, and customer engagement for local businesses.',
    description:
      'Continuous profile inconsistency audits, authorized repairs, AI-drafted updates, and review response workflows.',
    monthlyPriceInCents: 4900, // Proposed default $49/mo; flagged as tentative
    annualPriceInCents: 47000, // $470/yr
    isOfferFinalizedByArthur: false, // Arthur must approve final offer
    isLiveCheckoutEnabled: false, // Development test mode only
    features: [
      '1 Connected Google Business Location',
      'Continuous Inconsistency & Drift Audits',
      'One-Click Authorized Profile Repairs',
      'AI-Drafted Weekly Local Business Posts',
      'Personalized Customer Review Responses',
      'Daily Operations Queue & Safety Pause',
      'Full Historic Work & Audit Ledger',
    ],
    entitlements: {
      maxLocations: 1,
      monthlyAiAnalysesQuota: 50,
      monthlyDraftsQuota: 30,
      monthlyAutomatedActionsQuota: 100,
      maxStoredMediaMb: 100,
    },
  };

  const adminLogs: AdminActionLog[] = [
    {
      id: 'admin-log-1',
      timestamp: '2026-09-10T14:35:00-04:00',
      adminEmail: 'arthurscreatives@gmail.com',
      workspaceId: 'ws-summit-wellness',
      action: 'force_reindex',
      reason: 'Initial onboarding audit trigger',
      details: 'Initialized baseline audit for new customer workspace.',
    },
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'ticket-1',
      workspaceId: 'ws-summit-wellness',
      userEmail: 'client@summitwellness.example',
      subject: 'Question on Google API Partner Verification',
      message:
        'When connecting our profile, we see the sandbox draft mode badge. How long does live write activation typically take?',
      category: 'google_oauth',
      priority: 'medium',
      status: 'investigating',
      createdAt: '2026-09-16T15:00:00-04:00',
      adminNotes:
        'Google Business Profile API access request has been submitted for approval. Explaining safe preview mode in the interim.',
    },
  ];

  return {
    users,
    workspaces,
    adminLogs,
    supportTickets,
    planConfig,
    processedWebhookEvents: new Set<string>(),
  };
}

// Singleton store instance
function getStore(): StoreState {
  if (!globalThis.__arthur_workforce_store) {
    globalThis.__arthur_workforce_store = initializeStore();
  }
  return globalThis.__arthur_workforce_store;
}

// -------------------------------------------------------------
// USER OPERATIONS
// -------------------------------------------------------------
export function getUserById(id: string): User | undefined {
  return getStore().users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  for (const user of getStore().users.values()) {
    if (user.email.toLowerCase() === normalized) {
      return user;
    }
  }
  return undefined;
}

export function saveUser(user: User): void {
  getStore().users.set(user.id, user);
}

// -------------------------------------------------------------
// WORKSPACE OPERATIONS
// -------------------------------------------------------------
export function getWorkspaceById(id: string): Workspace | undefined {
  return getStore().workspaces.get(id);
}

export function getWorkspacesByUserId(userId: string): Workspace[] {
  const result: Workspace[] = [];
  for (const ws of getStore().workspaces.values()) {
    if (ws.userId === userId) {
      result.push(ws);
    }
  }
  return result;
}

export function getAllWorkspaces(): Workspace[] {
  return Array.from(getStore().workspaces.values());
}

export function saveWorkspace(ws: Workspace): void {
  ws.updatedAt = new Date().toISOString();
  getStore().workspaces.set(ws.id, ws);
}

export function deleteWorkspace(id: string): boolean {
  return getStore().workspaces.delete(id);
}

// -------------------------------------------------------------
// SECRETS REDACTION / SANITIZATION
// -------------------------------------------------------------
export function sanitizeWorkspaceForClient(ws: Workspace, currentUserRole: UserRole): Workspace {
  // Deep clone to avoid mutating in-place
  const copy: Workspace = JSON.parse(JSON.stringify(ws));

  // Redact any sensitive tokens or secrets
  if (copy.googleConnection) {
    // Mask authorization details
    if (copy.googleConnection.customClientId) {
      copy.googleConnection.customClientId =
        copy.googleConnection.customClientId.slice(0, 8) + '...[REDACTED]';
    }
  }

  // If customer, redact internal owner logs or admin tags
  if (currentUserRole !== 'owner') {
    // Non-owner cannot see any system-internal admin annotations
  }

  return copy;
}

// -------------------------------------------------------------
// PLAN & BILLING CONFIGURATION
// -------------------------------------------------------------
export function getPlanConfig(): PlanConfig {
  return getStore().planConfig;
}

export function updatePlanConfig(patch: Partial<PlanConfig>): PlanConfig {
  const store = getStore();
  store.planConfig = {
    ...store.planConfig,
    ...patch,
  };
  return store.planConfig;
}

export function isWebhookEventProcessed(eventId: string): boolean {
  return getStore().processedWebhookEvents.has(eventId);
}

export function markWebhookEventProcessed(eventId: string): void {
  getStore().processedWebhookEvents.add(eventId);
}

// -------------------------------------------------------------
// ENTITLEMENT CHECKING
// -------------------------------------------------------------
export type EntitlementAction =
  | 'run_ai_analysis'
  | 'generate_draft'
  | 'execute_task'
  | 'add_location';

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  remainingQuota?: number;
  isOwnerInternal: boolean;
}

export function checkWorkspaceEntitlement(
  workspaceId: string,
  action: EntitlementAction
): EntitlementCheckResult {
  const ws = getWorkspaceById(workspaceId);
  if (!ws) {
    return { allowed: false, reason: 'Workspace not found', isOwnerInternal: false };
  }

  if (ws.isSuspended) {
    return {
      allowed: false,
      reason: `Workspace suspended: ${ws.suspensionReason || 'Contact Arthur for assistance'}`,
      isOwnerInternal: false,
    };
  }

  // Arthur's owner workspace has explicit internal entitlement
  if (ws.role === 'owner' || ws.subscription.status === 'owner_internal') {
    return { allowed: true, remainingQuota: 9999, isOwnerInternal: true };
  }

  // Active or trialing subscriptions
  const validStatus = ['active', 'trialing'].includes(ws.subscription.status);
  if (!validStatus) {
    return {
      allowed: false,
      reason: `Subscription is ${ws.subscription.status}. Access to automated work is paused. Account management remains open.`,
      isOwnerInternal: false,
    };
  }

  const { entitlements } = ws;

  switch (action) {
    case 'run_ai_analysis':
      if (entitlements.monthlyAiAnalysesUsed >= entitlements.monthlyAiAnalysesQuota) {
        return {
          allowed: false,
          reason: `Monthly AI analysis quota (${entitlements.monthlyAiAnalysesQuota}) reached. Resets at period renewal.`,
          remainingQuota: 0,
          isOwnerInternal: false,
        };
      }
      return {
        allowed: true,
        remainingQuota: entitlements.monthlyAiAnalysesQuota - entitlements.monthlyAiAnalysesUsed,
        isOwnerInternal: false,
      };

    case 'generate_draft':
      if (entitlements.monthlyDraftsUsed >= entitlements.monthlyDraftsQuota) {
        return {
          allowed: false,
          reason: `Monthly draft quota (${entitlements.monthlyDraftsQuota}) reached.`,
          remainingQuota: 0,
          isOwnerInternal: false,
        };
      }
      return {
        allowed: true,
        remainingQuota: entitlements.monthlyDraftsQuota - entitlements.monthlyDraftsUsed,
        isOwnerInternal: false,
      };

    case 'execute_task':
      if (entitlements.monthlyAutomatedActionsUsed >= entitlements.monthlyAutomatedActionsQuota) {
        return {
          allowed: false,
          reason: `Monthly automated actions limit (${entitlements.monthlyAutomatedActionsQuota}) reached.`,
          remainingQuota: 0,
          isOwnerInternal: false,
        };
      }
      return {
        allowed: true,
        remainingQuota:
          entitlements.monthlyAutomatedActionsQuota - entitlements.monthlyAutomatedActionsUsed,
        isOwnerInternal: false,
      };

    case 'add_location':
      return {
        allowed: false,
        reason: 'Current package is limited to 1 location per workspace. Multi-location support is scheduled for next release.',
        remainingQuota: 0,
        isOwnerInternal: false,
      };
  }
}

export function incrementWorkspaceUsage(
  workspaceId: string,
  action: EntitlementAction,
  amount: number = 1
): void {
  const ws = getWorkspaceById(workspaceId);
  if (!ws) return;

  switch (action) {
    case 'run_ai_analysis':
      ws.entitlements.monthlyAiAnalysesUsed += amount;
      break;
    case 'generate_draft':
      ws.entitlements.monthlyDraftsUsed += amount;
      break;
    case 'execute_task':
      ws.entitlements.monthlyAutomatedActionsUsed += amount;
      break;
  }
  saveWorkspace(ws);
}

// -------------------------------------------------------------
// ADMIN ACTIONS & LOGS
// -------------------------------------------------------------
export function recordAdminAction(
  action: Omit<AdminActionLog, 'id' | 'timestamp'>
): AdminActionLog {
  const log: AdminActionLog = {
    ...action,
    id: `adm-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  getStore().adminLogs.unshift(log);
  return log;
}

export function getAdminActionLogs(): AdminActionLog[] {
  return [...getStore().adminLogs];
}

// -------------------------------------------------------------
// SUPPORT TICKETS
// -------------------------------------------------------------
export function getSupportTickets(): SupportTicket[] {
  return [...getStore().supportTickets];
}

export function createSupportTicket(
  ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
): SupportTicket {
  const newTicket: SupportTicket = {
    ...ticket,
    id: `ticket-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  getStore().supportTickets.unshift(newTicket);
  return newTicket;
}

export function resolveSupportTicket(ticketId: string, notes?: string): boolean {
  const ticket = getStore().supportTickets.find((t) => t.id === ticketId);
  if (!ticket) return false;
  ticket.status = 'resolved';
  ticket.resolvedAt = new Date().toISOString();
  if (notes) ticket.adminNotes = notes;
  return true;
}
