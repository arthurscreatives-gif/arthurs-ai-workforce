import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  SearchInsightMetrics,
  MonthlyPerformanceMetric,
  DailyPerformanceMetric,
  SearchTermItem,
  ContentDraft,
  ActivityLog,
  AppSettings,
  InspectorFinding,
  RepairProposal,
  TaskQueueItem,
  WorkforceAlert,
  TodaysWorkSummary,
} from '@/types/business-profile';
import { generate30DayHistoricalMetrics } from '@/lib/daily-metrics-generator';

export const INITIAL_APPROVED_FACTS: ApprovedBusinessFacts = {
  businessName: '',
  description: '',
  phoneNumber: '',
  websiteUri: '',
  primaryCategory: '',
  additionalCategories: [],
  services: [],
  regularHours: {
    Monday: { open: '09:00', close: '17:00', isClosed: false },
    Tuesday: { open: '09:00', close: '17:00', isClosed: false },
    Wednesday: { open: '09:00', close: '17:00', isClosed: false },
    Thursday: { open: '09:00', close: '17:00', isClosed: false },
    Friday: { open: '09:00', close: '17:00', isClosed: false },
    Saturday: { open: '00:00', close: '00:00', isClosed: true },
    Sunday: { open: '00:00', close: '00:00', isClosed: true },
  },
  serviceAreas: [],
  isAddressVisible: false,
  address: {
    addressLines: [],
    locality: '',
    administrativeArea: '',
    postalCode: '',
    regionCode: 'US',
  },
  approvedOffers: [],
  brandVoice: 'Professional, helpful, and community-focused tone.',
  ownerInstructions: 'Prioritize accuracy and verified business information.',
  lastConfirmedAt: 'Pending Setup',
};

export const INITIAL_GOOGLE_PROFILE: GoogleBusinessProfile = {
  name: '',
  title: '',
  storeCode: '',
  profileDescription: '',
  phoneNumbers: {
    primaryPhone: '',
  },
  websiteUri: '',
  primaryCategory: '',
  additionalCategories: [],
  regularHours: {
    Monday: { open: '09:00', close: '17:00', isClosed: false },
    Tuesday: { open: '09:00', close: '17:00', isClosed: false },
    Wednesday: { open: '09:00', close: '17:00', isClosed: false },
    Thursday: { open: '09:00', close: '17:00', isClosed: false },
    Friday: { open: '09:00', close: '17:00', isClosed: false },
    Saturday: { open: '00:00', close: '00:00', isClosed: true },
    Sunday: { open: '00:00', close: '00:00', isClosed: true },
  },
  serviceArea: {
    businessType: 'CUSTOMER_LOCATION_ONLY',
    places: [],
  },
  address: {
    addressLines: [],
    locality: '',
    administrativeArea: '',
    postalCode: '',
    regionCode: 'US',
  },
  isAddressVisible: false,
  services: [],
  verificationStatus: 'UNVERIFIED',
  lastGoogleSyncAt: 'Not connected yet',
};

export const INITIAL_FINDINGS: InspectorFinding[] = [];

export const INITIAL_REPAIR_PROPOSALS: RepairProposal[] = [];

export const DEFAULT_MONTHLY_PERFORMANCE: MonthlyPerformanceMetric[] = [
  { month: 'Oct 2025', shortMonth: 'Oct', views: 2420, searchViews: 1650, mapsViews: 770, clicks: 172, websiteClicks: 128, callClicks: 44, actions: 148 },
  { month: 'Nov 2025', shortMonth: 'Nov', views: 2850, searchViews: 1980, mapsViews: 870, clicks: 210, websiteClicks: 156, callClicks: 54, actions: 182 },
  { month: 'Dec 2025', shortMonth: 'Dec', views: 3310, searchViews: 2320, mapsViews: 990, clicks: 258, websiteClicks: 194, callClicks: 64, actions: 224 },
  { month: 'Jan 2026', shortMonth: 'Jan', views: 3740, searchViews: 2640, mapsViews: 1100, clicks: 312, websiteClicks: 238, callClicks: 74, actions: 270 },
  { month: 'Feb 2026', shortMonth: 'Feb', views: 4220, searchViews: 2980, mapsViews: 1240, clicks: 365, websiteClicks: 280, callClicks: 85, actions: 318 },
  { month: 'Mar 2026', shortMonth: 'Mar', views: 4890, searchViews: 3450, mapsViews: 1440, clicks: 424, websiteClicks: 326, callClicks: 98, actions: 372 },
  { month: 'Apr 2026', shortMonth: 'Apr', views: 5380, searchViews: 3820, mapsViews: 1560, clicks: 482, websiteClicks: 372, callClicks: 110, actions: 425 },
  { month: 'May 2026', shortMonth: 'May', views: 5940, searchViews: 4210, mapsViews: 1730, clicks: 546, websiteClicks: 424, callClicks: 122, actions: 480 },
  { month: 'Jun 2026', shortMonth: 'Jun', views: 6480, searchViews: 4610, mapsViews: 1870, clicks: 615, websiteClicks: 478, callClicks: 137, actions: 542 },
  { month: 'Jul 2026', shortMonth: 'Jul', views: 7120, searchViews: 5080, mapsViews: 2040, clicks: 688, websiteClicks: 535, callClicks: 153, actions: 608 },
  { month: 'Aug 2026', shortMonth: 'Aug', views: 7850, searchViews: 5620, mapsViews: 2230, clicks: 764, websiteClicks: 595, callClicks: 169, actions: 678 },
  { month: 'Sep 2026', shortMonth: 'Sep', views: 8640, searchViews: 6190, mapsViews: 2450, clicks: 848, websiteClicks: 662, callClicks: 186, actions: 754 },
];

export const INITIAL_SEARCH_TERMS: SearchTermItem[] = [
  {
    id: 'st-1',
    query: 'digital workforce agency',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 1420,
    relevance: 'Core Service',
    volumeTier: 'High',
    matchedService: 'AI Workforce Architecture',
    relevanceScore: 98,
    notes: 'Direct commercial intent query for digital workforce solutions.',
  },
  {
    id: 'st-2',
    query: 'ai receptionist for small business',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 890,
    relevance: 'Primary Product',
    volumeTier: 'High',
    matchedService: 'AI Phone Receptionist',
    relevanceScore: 95,
    notes: 'Strong local and national search velocity.',
  },
  {
    id: 'st-3',
    query: 'business process automation agents',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 640,
    relevance: 'Operations',
    volumeTier: 'Moderate',
    matchedService: 'Internal Operations Agents',
    relevanceScore: 90,
    notes: 'B2B enterprise operational inquiries.',
  },
  {
    id: 'st-4',
    query: 'automated customer service bot setup',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 510,
    relevance: 'Customer Care',
    volumeTier: 'Moderate',
    matchedService: 'Customer-Service Chatbots',
    relevanceScore: 88,
    notes: 'High conversion for rapid deployment.',
  },
  {
    id: 'st-5',
    query: 'ai appointment booking system',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 420,
    relevance: 'Lead Gen',
    volumeTier: 'Moderate',
    matchedService: 'Appointment Schedulers',
    relevanceScore: 87,
    notes: 'Consistently generates website click-throughs.',
  },
  {
    id: 'st-6',
    query: 'no-code ai workforce platform',
    type: 'ai_suggested',
    isObserved: false,
    estimatedVolume: 780,
    relevance: 'Suggested Opportunity',
    volumeTier: 'Opportunity',
    matchedService: 'Arthur Platform Architecture',
    relevanceScore: 92,
    notes: 'Opportunity to highlight no-code setup in post drafts.',
  },
  {
    id: 'st-7',
    query: 'lead follow-up automation consultant',
    type: 'ai_suggested',
    isObserved: false,
    estimatedVolume: 490,
    relevance: 'Suggested Opportunity',
    volumeTier: 'Opportunity',
    matchedService: 'Lead Follow-up Agents',
    relevanceScore: 89,
    notes: 'Recommended topic for monthly Google update post.',
  },
];

export const DEFAULT_DAILY_PERFORMANCE: DailyPerformanceMetric[] = generate30DayHistoricalMetrics(
  6190,
  2450,
  662,
  186,
  new Date('2026-09-23T12:00:00Z')
);

export const INITIAL_SEARCH_INSIGHTS: SearchInsightMetrics = {
  reportingPeriod: 'Last 30 Days (Settled)',
  lastSyncAt: 'Google Cloud Platform API',
  lastSyncedAt: 'Just synced',
  reportingDelayNotice:
    'Google Business Profile performance data is updated automatically once your profile is connected.',
  impressionsSearch: 6190,
  impressionsMaps: 2450,
  callClicks: 186,
  websiteClicks: 662,
  directionRequests: 0,
  monthlyHistory: DEFAULT_MONTHLY_PERFORMANCE,
  dailyHistory: DEFAULT_DAILY_PERFORMANCE,
  comparison: {
    priorPeriodLabel: 'Prior 30 Days',
    impressionsChangePercent: 18.5,
    websiteClicksChangePercent: 24.1,
    callClicksChangePercent: 12.0,
  },
  topSearchQueries: INITIAL_SEARCH_TERMS,
};

export const INITIAL_CONTENT_DRAFTS: ContentDraft[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_APP_SETTINGS: AppSettings = {
  ownerEmail: '',
  automationMode: 'review_first',
  isAutomationPaused: false,
  allowedAutopilotActions: [],
  protectedFields: [
    'businessName',
    'address',
    'isAddressVisible',
    'phoneNumbers',
    'websiteUri',
    'primaryCategory',
    'additionalCategories',
    'regularHours',
    'serviceAreas',
    'approvedOffers',
    'deletions',
  ],
  dailyInspectionSchedule: {
    enabled: true,
    time: '09:00',
    timezone: 'America/New_York',
  },
  weeklyReviewSchedule: {
    enabled: true,
  },
  monthlyKeywordAnalysisSchedule: {
    enabled: true,
  },
  limits: {
    monthlyAiQuota: 100,
    monthlyAiUsed: 0,
    dailyTaskQuota: 25,
    dailyTaskUsed: 0,
  },
  googleCloud: {
    projectId: '',
    clientIdConfigured: false,
    businessProfileApiEnabled: false,
    apiApprovalStatus: 'not_requested',
  },
  notifications: {
    externalDeliveryEnabled: false,
    notificationEmail: '',
  },
};

export const INITIAL_TASK_QUEUE: TaskQueueItem[] = [];

export const INITIAL_ALERTS: WorkforceAlert[] = [];

export const INITIAL_TODAYS_WORK: TodaysWorkSummary = {
  date: new Date().toISOString().split('T')[0],
  checkedItems: [],
  changedAndVerified: [],
  publishedItems: [],
  needsApprovalItems: [],
  blockedOrFailedItems: [],
  totalTasksExecuted: 0,
  lastRunTimestamp: 'No runs yet',
};

// Aliases for convenient importing across components
export const defaultApprovedBusinessFacts = INITIAL_APPROVED_FACTS;
export const defaultLiveGoogleProfile = INITIAL_GOOGLE_PROFILE;
export const defaultFindings = INITIAL_FINDINGS;
export const defaultRepairProposals = INITIAL_REPAIR_PROPOSALS;
export const defaultSearchMetrics = INITIAL_SEARCH_INSIGHTS;
export const defaultContentDrafts = INITIAL_CONTENT_DRAFTS;
export const defaultActivityLogs = INITIAL_ACTIVITY_LOGS;
export const defaultSettings = INITIAL_APP_SETTINGS;
export const defaultTaskQueue = INITIAL_TASK_QUEUE;
export const defaultWorkforceAlerts = INITIAL_ALERTS;
export const defaultTodaysWork = INITIAL_TODAYS_WORK;
