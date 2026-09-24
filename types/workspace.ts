import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  InspectorFinding,
  RepairProposal,
  SearchInsightMetrics,
  ContentDraft,
  CustomerReview,
  AppSettings,
  TaskQueueItem,
  WorkforceAlert,
  TodaysWorkSummary,
  ActivityLog,
  ConnectionStatus,
} from './business-profile';

export type UserRole = 'owner' | 'customer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  emailVerified: boolean;
  verificationCode?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'owner_internal';

export interface WorkspaceSubscription {
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  billingInterval: 'month' | 'year';
  priceInCents: number; // Configurable by Arthur
  isConfiguredByArthur: boolean; // Flag indicating if Arthur finalized pricing
  // 7-day trial & $1 credit card verification
  cardVerified?: boolean;
  cardLast4?: string;
  cardBrand?: string;
  trialEndsAt?: string;
  trialStartedAt?: string;
  verificationHoldCents?: number;
}

export interface SubscriptionTier {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPriceInCents: number;
  annualPriceInCents: number;
  trialDays: number; // 7
  verificationHoldCents: number; // 100 ($1.00)
  features: string[];
  entitlements: {
    maxLocations: number;
    monthlyAiAnalysesQuota: number;
    monthlyDraftsQuota: number;
    monthlyAutomatedActionsQuota: number;
    maxStoredMediaMb: number;
  };
}

export interface WorkspaceEntitlements {
  maxLocations: number; // 1 for this standalone edition
  monthlyAiAnalysesQuota: number;
  monthlyAiAnalysesUsed: number;
  monthlyDraftsQuota: number;
  monthlyDraftsUsed: number;
  monthlyAutomatedActionsQuota: number;
  monthlyAutomatedActionsUsed: number;
  maxStoredMediaMb: number;
  storedMediaMbUsed: number;
}

export type GoogleProjectModel = 'central_verified' | 'byop';

export interface GoogleConnectionDetails {
  status: 'sandbox_preview' | 'connected_live' | 'approval_pending' | 'disconnected';
  projectModel: GoogleProjectModel;
  googleAccountId?: string;
  locationId?: string;
  authorizedEmail?: string;
  scopeGranted?: string[];
  customClientId?: string;
  gcpProjectId?: string;
  connectedAt?: string;
  lastTokenRefreshAt?: string;
  readOnlyReason?: string;
}

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  businessName: string;
  locationId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  
  // Profile & Operational State
  connectionStatus: ConnectionStatus;
  googleConnection: GoogleConnectionDetails;
  subscription: WorkspaceSubscription;
  entitlements: WorkspaceEntitlements;
  
  approvedFacts: ApprovedBusinessFacts;
  liveProfile: GoogleBusinessProfile;
  settings: AppSettings;
  findings: InspectorFinding[];
  repairProposals: RepairProposal[];
  searchInsights: SearchInsightMetrics;
  drafts: ContentDraft[];
  reviews: CustomerReview[];
  taskQueue: TaskQueueItem[];
  alerts: WorkforceAlert[];
  todaysWork: TodaysWorkSummary;
  logs: ActivityLog[];
  
  // Administrative Safety Flags
  isSuspended: boolean;
  suspensionReason?: string;
  suspendedAt?: string;
  dataRetentionExpiresAt?: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  monthlyPriceInCents: number;
  annualPriceInCents: number;
  isOfferFinalizedByArthur: boolean;
  isLiveCheckoutEnabled: boolean; // Kept false until Arthur approves
  features: string[];
  entitlements: {
    maxLocations: number;
    monthlyAiAnalysesQuota: number;
    monthlyDraftsQuota: number;
    monthlyAutomatedActionsQuota: number;
    maxStoredMediaMb: number;
  };
}

export interface AdminActionLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  workspaceId: string;
  action: 'suspend_workspace' | 'unsuspend_workspace' | 'pause_automation' | 'unpause_automation' | 'force_reindex' | 'purge_workspace_data';
  reason: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  workspaceId: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'google_oauth' | 'profile_sync' | 'billing' | 'feature_request' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface OnboardingState {
  currentStep: number;
  accountCreated: boolean;
  workspaceCreated: boolean;
  packageReviewed: boolean;
  profileConnected: boolean;
  locationSelected: boolean;
  factsConfirmed: boolean;
  auditRun: boolean;
  automationChosen: boolean;
  businessName: string;
  locationTitle: string;
  connectionType: 'sandbox_preview' | 'google_oauth' | 'byop';
}
