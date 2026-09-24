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

  const planConfig: PlanConfig = {
    id: 'plan_starter',
    name: 'Starter AI Workforce',
    tagline: 'Intelligent profile accuracy, automated audits, and customer engagement for local businesses.',
    description:
      'Continuous profile inconsistency audits, authorized repairs, AI-drafted updates, and review response workflows.',
    monthlyPriceInCents: 4900,
    annualPriceInCents: 47000,
    isOfferFinalizedByArthur: true,
    isLiveCheckoutEnabled: true,
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

  return {
    users,
    workspaces,
    adminLogs: [],
    supportTickets: [],
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

export function createWorkspaceForUser({
  userId,
  userEmail,
  businessName,
  role = 'customer',
  planId = 'starter',
  planName = 'Starter AI Workforce',
  priceInCents = 4900,
}: {
  userId: string;
  userEmail: string;
  businessName: string;
  role?: UserRole;
  planId?: string;
  planName?: string;
  priceInCents?: number;
}): Workspace {
  const wsId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const ws: Workspace = {
    id: wsId,
    userId,
    name: businessName ? `${businessName} Workspace` : 'My Business Workspace',
    businessName: businessName || '',
    locationId: '',
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    connectionStatus: 'not_connected',
    googleConnection: {
      status: 'disconnected',
      projectModel: 'central_verified',
      authorizedEmail: userEmail,
      scopeGranted: [],
    },

    subscription: {
      planId,
      planName,
      status: 'trialing',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      billingInterval: 'month',
      priceInCents,
      isConfiguredByArthur: true,
    },

    entitlements: {
      maxLocations: planId === 'enterprise' ? 10 : planId === 'growth' ? 3 : 1,
      monthlyAiAnalysesQuota: planId === 'enterprise' ? 500 : planId === 'growth' ? 200 : 50,
      monthlyAiAnalysesUsed: 0,
      monthlyDraftsQuota: planId === 'enterprise' ? 150 : planId === 'growth' ? 60 : 30,
      monthlyDraftsUsed: 0,
      monthlyAutomatedActionsQuota: planId === 'enterprise' ? 500 : planId === 'growth' ? 250 : 100,
      monthlyAutomatedActionsUsed: 0,
      maxStoredMediaMb: 500,
      storedMediaMbUsed: 0,
    },

    approvedFacts: {
      ...defaultApprovedBusinessFacts,
      businessName: businessName || '',
    },
    liveProfile: {
      ...defaultLiveGoogleProfile,
      title: businessName || '',
    },
    settings: {
      ...defaultSettings,
      ownerEmail: userEmail,
      automationMode: 'review_first',
      isAutomationPaused: false,
      allowedAutopilotActions: [],
    },
    findings: [],
    repairProposals: [],
    searchInsights: {
      ...defaultSearchMetrics,
    },
    drafts: [],
    reviews: [],
    taskQueue: [],
    alerts: [],
    todaysWork: {
      ...defaultTodaysWork,
      date: new Date().toISOString().split('T')[0],
    },
    logs: [],
    isSuspended: false,
  };

  saveWorkspace(ws);
  return ws;
}

// -------------------------------------------------------------
// SECRETS REDACTION / SANITIZATION
// -------------------------------------------------------------
export function sanitizeWorkspaceForClient(ws: Workspace, currentUserRole: UserRole): Workspace {
  // Deep clone to avoid mutating in-place
  const copy: Workspace = JSON.parse(JSON.stringify(ws));

  // Redact any sensitive tokens or secrets
  if (copy.googleConnection) {
    if (copy.googleConnection.customClientId) {
      copy.googleConnection.customClientId =
        copy.googleConnection.customClientId.slice(0, 8) + '...[REDACTED]';
    }
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
      reason: `Workspace suspended: ${ws.suspensionReason || 'Contact support for assistance'}`,
      isOwnerInternal: false,
    };
  }

  if (ws.role === 'owner' || ws.subscription.status === 'owner_internal') {
    return { allowed: true, remainingQuota: 9999, isOwnerInternal: true };
  }

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
