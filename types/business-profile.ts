export type ConnectionStatus =
  | 'not_connected'
  | 'awaiting_google_access'
  | 'connected'
  | 'reconnection_required'
  | 'permission_denied';

export interface LocationAddress {
  addressLines: string[];
  locality: string;
  administrativeArea: string;
  postalCode: string;
  regionCode: string;
}

export interface BusinessServiceItem {
  id: string;
  name: string;
  description: string;
  price?: string;
  isCustomService?: boolean;
}

export interface BusinessHoursDay {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface ApprovedBusinessFacts {
  businessName: string;
  description: string;
  phoneNumber: string;
  websiteUri: string;
  primaryCategory: string;
  additionalCategories: string[];
  services: BusinessServiceItem[];
  regularHours: Record<string, BusinessHoursDay>;
  serviceAreas: string[];
  isAddressVisible: boolean;
  address: LocationAddress;
  approvedOffers: Array<{
    id: string;
    title: string;
    details: string;
    validThrough: string;
  }>;
  brandVoice: string;
  ownerInstructions: string;
  lastConfirmedAt: string;
}

export interface GoogleBusinessProfile {
  name: string; // resource name accounts/X/locations/Y
  title: string;
  storeCode?: string;
  profileDescription: string;
  phoneNumbers: {
    primaryPhone: string;
    additionalPhones?: string[];
  };
  websiteUri: string;
  primaryCategory: string;
  additionalCategories: string[];
  regularHours: Record<string, BusinessHoursDay>;
  serviceArea: {
    businessType: 'CUSTOMER_AND_BUSINESS_LOCATION' | 'CUSTOMER_LOCATION_ONLY';
    places: string[];
  };
  address: LocationAddress;
  isAddressVisible: boolean;
  services: BusinessServiceItem[];
  verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'UNVERIFIED';
  lastGoogleSyncAt: string;
  readOnlyReason?: string;
}

export interface InspectorFinding {
  id: string;
  field: string;
  fieldLabel: string;
  issue: string;
  evidence: string;
  whyItMatters: string;
  proposedAction: string;
  priority: 'high' | 'medium' | 'low';
  isRepairableThroughIntegration: boolean;
  detectedAt: string;
  status: 'open' | 'addressed' | 'dismissed';
}

export type RepairStatus =
  | 'proposed'
  | 'approved'
  | 'submitted'
  | 'confirmed_by_api'
  | 'publicly_verified'
  | 'dismissed'
  | 'failed'
  | 'conflict_detected'
  | 'rolled_back';

export interface RepairProposal {
  id: string;
  field: string;
  fieldLabel: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  evidence: string;
  isProtectedField: boolean; // protected: name, address, phone, website, categories, hours, areas, prices, deletions
  requiresApproval: boolean;
  status: RepairStatus;
  proposedAt: string;
  appliedAt?: string;
  rollbackAvailable: boolean;
  previousValueSnapshot?: string;
  errorMessage?: string;
  verificationStep?: string;
}

export interface MonthlyPerformanceMetric {
  month: string; // e.g. "Apr 2026"
  shortMonth: string; // e.g. "Apr"
  views: number; // Search + Maps views (impressions)
  searchViews: number;
  mapsViews: number;
  clicks: number; // Total clicks (website + call buttons)
  websiteClicks: number;
  callClicks: number;
  actions: number; // Total customer actions on profile
}

export interface DailyPerformanceMetric {
  date: string; // "Aug 25", "Sep 1", etc.
  fullDate: string; // "Aug 25, 2026"
  isoDate: string; // "2026-08-25"
  dayOfWeek: string; // "Tue", "Wed", etc.
  searchImpressions: number;
  mapsImpressions: number;
  totalImpressions: number;
  websiteClicks: number;
  callClicks: number;
  totalClicks: number;
  actions: number;
  cumulativeImpressions: number;
  cumulativeClicks: number;
  movingAverage7d?: number;
  growthVsStartPercent?: number;
  isProcessingWindow?: boolean; // Last 48-72h subject to Google Business Profile latency
}

export interface SearchInsightMetrics {
  reportingPeriod: string;
  lastSyncAt: string;
  lastSyncedAt?: string;
  reportingDelayNotice: string;
  impressionsSearch: number | null;
  impressionsMaps: number | null;
  callClicks: number | null; // explicitly labeled as button clicks, not confirmed customers
  websiteClicks: number | null;
  directionRequests: number | null;
  monthlyHistory?: MonthlyPerformanceMetric[];
  dailyHistory?: DailyPerformanceMetric[];
  comparison: {
    priorPeriodLabel: string;
    impressionsChangePercent: number | null;
    websiteClicksChangePercent: number | null;
    callClicksChangePercent: number | null;
  };
  topSearchQueries: SearchTermItem[];
}

export interface SearchQueryItem {
  query: string;
  isObserved: boolean;
  estimatedVolume?: number;
  relevance: string;
}

export interface SearchTermItem {
  id: string;
  query: string;
  type: 'observed' | 'ai_suggested'; // strict separation
  isObserved?: boolean;
  estimatedVolume?: number;
  relevance?: string;
  volumeTier: 'High' | 'Moderate' | 'Emerging' | 'Opportunity';
  matchedService: string;
  relevanceScore: number;
  notes: string;
}

export interface ContentDraft {
  id: string;
  type: 'service_spotlight' | 'small_business_tip' | 'project_highlight' | 'approved_offer';
  typeLabel: string;
  title: string;
  body: string;
  callToAction: 'LEARN_MORE' | 'CALL_NOW' | 'GET_OFFER' | 'BOOK' | 'NONE';
  ctaUrl: string;
  createdAt: string;
  status: 'draft' | 'saved' | 'dismissed';
}

export interface ActivityLog {
  id: string;
  timestamp: string; // formatted in America/New_York
  action: string;
  details: string;
  field?: string;
  beforeValue?: string;
  afterValue?: string;
  authorization: 'owner_manual_approval' | 'routine_autopilot' | 'system_inspection' | 'owner_revocation';
  result: 'success' | 'pending' | 'failed' | 'conflict_detected' | 'restored';
  notes?: string;
}

export type AITaskState = 'Queued' | 'Analyzing' | 'Ready' | 'Applied' | 'Failed';

export interface CustomerReview {
  id: string;
  reviewerName: string;
  starRating: number;
  comment: string;
  createTime: string;
  serviceMentioned?: string;
  reply?: ReviewReplyDraft;
}

export interface ReviewReplyDraft {
  id: string;
  reviewId: string;
  replyText: string;
  isSensitiveComplaint: boolean;
  sensitivityReason?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'draft' | 'approved' | 'dismissed';
  createdAt: string;
  approvedAt?: string;
}

export interface AppSettings {
  ownerEmail: string;
  automationMode: 'review_first' | 'routine_autopilot';
  isAutomationPaused: boolean;
  allowedAutopilotActions: string[];
  protectedFields: string[];
  dailyInspectionSchedule: {
    enabled: boolean;
    time: string; // "09:00"
    timezone: string; // "America/New_York"
  };
  weeklyReviewSchedule: {
    enabled: boolean;
  };
  monthlyKeywordAnalysisSchedule: {
    enabled: boolean;
  };
  limits: {
    monthlyAiQuota: number;
    monthlyAiUsed: number;
    dailyTaskQuota: number;
    dailyTaskUsed: number;
  };
  googleCloud: {
    projectId: string;
    clientIdConfigured: boolean;
    businessProfileApiEnabled: boolean;
    apiApprovalStatus: 'approved' | 'pending_partner_review' | 'not_requested';
  };
  notifications?: {
    externalDeliveryEnabled: boolean;
    notificationEmail?: string;
  };
}

export type TaskExecutionStatus =
  | 'Queued'
  | 'Awaiting Approval'
  | 'Running'
  | 'Completed'
  | 'Blocked'
  | 'Failed'
  | 'Canceled';

export type TaskApprovalStatus = 'pending_approval' | 'approved' | 'not_required' | 'rejected';

export interface TaskQueueItem {
  id: string;
  action: string;
  reason: string;
  category: 'inspection' | 'repair' | 'post' | 'review' | 'metrics' | 'health_check';
  createdAt: string; // America/New_York
  scheduledTime?: string; // America/New_York
  completedAt?: string;
  approvalStatus: TaskApprovalStatus;
  executionStatus: TaskExecutionStatus;
  result?: string;
  error?: string;
  targetField?: string;
  targetId?: string;
  targetLabel?: string;
  requiresOwnerApproval: boolean;
  isProtectedField?: boolean;
  retryCount?: number;
  deduplicationKey: string;
  deferredDueToLimit?: boolean;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertCategory =
  | 'google_reconnection'
  | 'ai_failure'
  | 'repair_conflict'
  | 'post_failure'
  | 'review_attention'
  | 'usage_limit'
  | 'repeated_failure';

export interface WorkforceAlert {
  id: string;
  category: AlertCategory;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: string; // America/New_York
  actionLabel: string;
  actionType:
    | 'open_connect'
    | 'test_ai'
    | 'view_diff'
    | 'view_review'
    | 'view_settings'
    | 'retry_task'
    | 'unpause_automation'
    | 'dismiss';
  targetId?: string;
  targetTab?: string;
  resolved: boolean;
  resolvedAt?: string;
  occurrenceCount: number; // grouped occurrences
  lastOccurrenceAt: string;
}

export interface TodaysWorkSummary {
  date: string; // America/New_York date
  checkedItems: string[];
  changedAndVerified: string[];
  publishedItems: string[];
  needsApprovalItems: string[];
  blockedOrFailedItems: string[];
  totalTasksExecuted: number;
  lastRunTimestamp?: string;
}

