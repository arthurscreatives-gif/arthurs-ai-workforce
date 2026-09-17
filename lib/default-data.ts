import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  SearchInsightMetrics,
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

export const INITIAL_APPROVED_FACTS: ApprovedBusinessFacts = {
  businessName: "Arthur's Creatives",
  description:
    "Arthur's Creatives is a dedicated creative agency and local business consulting studio. We craft high-impact brand identities, modern web designs, and automated digital workforce solutions that help local companies attract and retain clients across Google Search and Maps.",
  phoneNumber: '+1 (555) 329-8472',
  websiteUri: 'https://arthurscreatives.com',
  primaryCategory: 'Marketing Agency',
  additionalCategories: [
    'Website Designer',
    'Consultant',
    'Internet Marketing Service',
  ],
  services: [
    {
      id: 'srv-1',
      name: 'Google Business Profile Management & Optimization',
      description:
        'Complete setup, verification, continuous optimization, and search presence maintenance for local service businesses on Google Maps and Search.',
      price: 'Starting at $350/mo',
    },
    {
      id: 'srv-2',
      name: 'Custom Brand Identity & Graphic Design',
      description:
        'Professional logo creation, typography systems, color schemes, and marketing collateral tailored to local service companies.',
      price: 'Custom quote based on scope',
    },
    {
      id: 'srv-3',
      name: 'Digital Workforce & Business Automation',
      description:
        'Implementation of automated customer reception, appointment booking integrations, and internal workflow assistants trained on proprietary business facts.',
      price: 'Starting at $500 setup',
    },
    {
      id: 'srv-4',
      name: 'Local Search Visibility & Citation Auditing',
      description:
        'Comprehensive audit of local search signals, customer review strategies, and location data accuracy to improve organic map pack discovery.',
      price: '$250 one-time audit',
    },
  ],
  regularHours: {
    Monday: { open: '09:00', close: '18:00', isClosed: false },
    Tuesday: { open: '09:00', close: '18:00', isClosed: false },
    Wednesday: { open: '09:00', close: '18:00', isClosed: false },
    Thursday: { open: '09:00', close: '18:00', isClosed: false },
    Friday: { open: '09:00', close: '18:00', isClosed: false },
    Saturday: { open: '10:00', close: '15:00', isClosed: false },
    Sunday: { open: '00:00', close: '00:00', isClosed: true },
  },
  serviceAreas: [
    'New York, NY',
    'Brooklyn, NY',
    'Queens, NY',
    'Manhattan, NY',
    'Staten Island, NY',
    'Jersey City, NJ',
  ],
  isAddressVisible: false, // Service-area business! Preserve hidden address as mandated
  address: {
    addressLines: ['Private Suite - Dispatch Base'],
    locality: 'New York',
    administrativeArea: 'NY',
    postalCode: '10001',
    regionCode: 'US',
  },
  approvedOffers: [
    {
      id: 'off-1',
      title: 'Complimentary Local Profile Health Inspection',
      details:
        'A thorough diagnostic review of your existing Google Business Profile to uncover missing attributes, inconsistent service categories, and keyword discovery opportunities.',
      validThrough: '2026-12-31',
    },
  ],
  brandVoice:
    'Professional, direct, grounded, craftsmanship-focused, and transparent. We explain technical concepts in plain English, never use marketing hyperbole, and always prioritize client trust.',
  ownerInstructions:
    'Strictly avoid keyword stuffing in the business title. Preserve service-area business status with hidden physical dispatch address. All updates must reflect verified services only.',
  lastConfirmedAt: '2026-09-15T14:30:00-04:00',
};

export const INITIAL_GOOGLE_PROFILE: GoogleBusinessProfile = {
  name: 'accounts/109847291049281/locations/89201948102948',
  title: "Arthur's Creatives",
  storeCode: 'AC-NYC-01',
  profileDescription:
    "Arthur's Creatives offers creative and marketing services for small businesses in New York.", // Incomplete vs approved facts!
  phoneNumbers: {
    primaryPhone: '+1 (555) 329-8472',
  },
  websiteUri: 'https://arthurscreatives.com',
  primaryCategory: 'Marketing Agency',
  additionalCategories: ['Website Designer'], // Missing 'Consultant' and 'Internet Marketing Service'
  regularHours: {
    Monday: { open: '09:00', close: '17:00', isClosed: false }, // Discrepancy: closed at 17:00 instead of 18:00
    Tuesday: { open: '09:00', close: '17:00', isClosed: false },
    Wednesday: { open: '09:00', close: '17:00', isClosed: false },
    Thursday: { open: '09:00', close: '17:00', isClosed: false },
    Friday: { open: '09:00', close: '17:00', isClosed: false },
    Saturday: { open: '00:00', close: '00:00', isClosed: true }, // Discrepancy: Saturday marked closed
    Sunday: { open: '00:00', close: '00:00', isClosed: true },
  },
  serviceArea: {
    businessType: 'CUSTOMER_LOCATION_ONLY',
    places: ['New York, NY', 'Brooklyn, NY', 'Queens, NY'],
  },
  address: {
    addressLines: ['Private Suite - Dispatch Base'],
    locality: 'New York',
    administrativeArea: 'NY',
    postalCode: '10001',
    regionCode: 'US',
  },
  isAddressVisible: false,
  services: [
    {
      id: 'srv-1',
      name: 'Google Business Profile Management & Optimization',
      description: 'Profile setup and management.', // Truncated/vague
    },
    {
      id: 'srv-2',
      name: 'Custom Brand Identity & Graphic Design',
      description: 'Logo creation and visual branding.',
    },
  ],
  verificationStatus: 'VERIFIED',
  lastGoogleSyncAt: '2026-09-17T08:15:00-04:00',
};

export const INITIAL_FINDINGS: InspectorFinding[] = [
  {
    id: 'find-1',
    field: 'profileDescription',
    fieldLabel: 'Business Description',
    issue: 'Brief description lacks details on digital workforce and local SEO capabilities',
    evidence: 'Current length is 86 characters (max 750). Fails to mention automated workforce solutions and local visibility optimization specified in approved facts.',
    whyItMatters: 'A comprehensive description informs search algorithms of your full breadth of services and helps searchers immediately understand what Arthur\'s Creatives delivers.',
    proposedAction: 'Update description with approved brand facts including digital workforce setup and Google Maps visibility consulting.',
    priority: 'high',
    isRepairableThroughIntegration: true,
    detectedAt: '2026-09-17T08:15:00-04:00',
    status: 'open',
  },
  {
    id: 'find-2',
    field: 'services',
    fieldLabel: 'Service Menu Catalog',
    issue: 'Missing 2 approved primary service listings',
    evidence: 'Approved facts list "Digital Workforce & Business Automation" and "Local Search Visibility & Citation Auditing", but they are absent from the Google Business Profile service catalog.',
    whyItMatters: 'Customers searching specifically for automation or citation audits on Maps may bypass the listing if these services are not explicitly cataloged.',
    proposedAction: 'Add the missing services with verified descriptions and pricing ranges from approved business facts.',
    priority: 'high',
    isRepairableThroughIntegration: true,
    detectedAt: '2026-09-17T08:15:00-04:00',
    status: 'open',
  },
  {
    id: 'find-3',
    field: 'regularHours',
    fieldLabel: 'Operating Hours',
    issue: 'Discrepancy in Friday close time and Saturday availability',
    evidence: 'Live Google profile shows Friday close at 17:00 (approved: 18:00) and Saturday as Closed (approved: Open 10:00 - 15:00).',
    whyItMatters: 'Potential weekend clients seeing "Closed" on Saturday will refrain from calling or submitting inquiries.',
    proposedAction: 'Synchronize operating hours to match confirmed owner schedule (open Saturdays 10:00 - 15:00).',
    priority: 'medium',
    isRepairableThroughIntegration: true,
    detectedAt: '2026-09-17T08:15:00-04:00',
    status: 'open',
  },
  {
    id: 'find-4',
    field: 'additionalCategories',
    fieldLabel: 'Secondary Categories',
    issue: 'Secondary categories incomplete',
    evidence: 'Live listing is missing "Consultant" and "Internet Marketing Service".',
    whyItMatters: 'Secondary categories expand eligibility for relevant non-branded search queries across local map pack searches.',
    proposedAction: 'Add verified secondary categories to match approved business facts.',
    priority: 'medium',
    isRepairableThroughIntegration: true,
    detectedAt: '2026-09-17T08:15:00-04:00',
    status: 'open',
  },
  {
    id: 'find-5',
    field: 'serviceAreas',
    fieldLabel: 'Service Area Coverage',
    issue: 'Service area list excludes Manhattan, Staten Island, and Jersey City',
    evidence: 'Live listing only specifies New York, Brooklyn, and Queens.',
    whyItMatters: 'Customers in Jersey City or Manhattan might not see location coverage indicated in profile summaries.',
    proposedAction: 'Submit request to add remaining approved service localities.',
    priority: 'low',
    isRepairableThroughIntegration: true,
    detectedAt: '2026-09-17T08:15:00-04:00',
    status: 'open',
  },
];

export const INITIAL_REPAIR_PROPOSALS: RepairProposal[] = [
  {
    id: 'rep-1',
    field: 'profileDescription',
    fieldLabel: 'Business Description',
    currentValue:
      "Arthur's Creatives offers creative and marketing services for small businesses in New York.",
    proposedValue:
      "Arthur's Creatives is a dedicated creative agency and local business consulting studio. We craft high-impact brand identities, modern web designs, and automated digital workforce solutions that help local companies attract and retain clients across Google Search and Maps.",
    reason:
      'Aligns profile with owner-confirmed business description, integrating digital workforce and local search visibility services naturally.',
    evidence:
      'Grounded in Approved Business Facts section last confirmed on Sept 15, 2026.',
    isProtectedField: false, // Description & service text can be eligible for routine autopilot when enabled
    requiresApproval: false,
    status: 'proposed',
    proposedAt: '2026-09-17T08:20:00-04:00',
    rollbackAvailable: true,
    previousValueSnapshot:
      "Arthur's Creatives offers creative and marketing services for small businesses in New York.",
  },
  {
    id: 'rep-2',
    field: 'services',
    fieldLabel: 'Service Item Descriptions',
    currentValue:
      'Google Business Profile Management & Optimization: Profile setup and management.',
    proposedValue:
      'Google Business Profile Management & Optimization: Complete setup, verification, continuous optimization, and search presence maintenance for local service businesses on Google Maps and Search.',
    reason:
      'Replaces vague 5-word description with complete, verified service explanation.',
    evidence:
      'Directly matches Approved Business Facts catalog item #srv-1.',
    isProtectedField: false,
    requiresApproval: false,
    status: 'proposed',
    proposedAt: '2026-09-17T08:20:00-04:00',
    rollbackAvailable: true,
    previousValueSnapshot:
      'Google Business Profile Management & Optimization: Profile setup and management.',
  },
  {
    id: 'rep-3',
    field: 'regularHours',
    fieldLabel: 'Operating Hours (Saturday)',
    currentValue: 'Saturday: Closed',
    proposedValue: 'Saturday: 10:00 - 15:00',
    reason:
      'Reflects verified weekend hours so Saturday prospect inquiries are not lost.',
    evidence: 'Approved Business Facts weekly operating calendar.',
    isProtectedField: true, // Hours is a PROTECTED field requiring explicit owner approval
    requiresApproval: true,
    status: 'proposed',
    proposedAt: '2026-09-17T08:20:00-04:00',
    rollbackAvailable: true,
    previousValueSnapshot: 'Saturday: Closed',
  },
  {
    id: 'rep-4',
    field: 'additionalCategories',
    fieldLabel: 'Additional Categories',
    currentValue: 'Website Designer',
    proposedValue: 'Website Designer, Consultant, Internet Marketing Service',
    reason:
      'Ensures Google categorizes Arthur’s Creatives for both marketing and consulting queries.',
    evidence: 'Approved Business Facts categories list.',
    isProtectedField: true, // Categories is a PROTECTED field
    requiresApproval: true,
    status: 'proposed',
    proposedAt: '2026-09-17T08:20:00-04:00',
    rollbackAvailable: true,
    previousValueSnapshot: 'Website Designer',
  },
];

export const INITIAL_SEARCH_TERMS: SearchTermItem[] = [
  // OBSERVED terms (Real Google measurements)
  {
    id: 'st-1',
    query: 'google business profile optimization brooklyn',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 420,
    relevance: 'Primary Category & Local Pack',
    volumeTier: 'High',
    matchedService: 'Google Business Profile Management & Optimization',
    relevanceScore: 98,
    notes: 'Observed query generating direct impressions in local search.',
  },
  {
    id: 'st-2',
    query: 'creative agency new york service business',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 310,
    relevance: 'Brand & Creative Strategy',
    volumeTier: 'High',
    matchedService: 'Custom Brand Identity & Graphic Design',
    relevanceScore: 92,
    notes: 'Observed query leading to profile views.',
  },
  {
    id: 'st-3',
    query: 'local seo agency manhattan',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 180,
    relevance: 'Local Discovery & Citation Coverage',
    volumeTier: 'Moderate',
    matchedService: 'Local Search Visibility & Citation Auditing',
    relevanceScore: 88,
    notes: 'Observed query from nearby service radius.',
  },
  {
    id: 'st-4',
    query: 'website redesign brooklyn ny',
    type: 'observed',
    isObserved: true,
    estimatedVolume: 140,
    relevance: 'Website Design & Conversion Consulting',
    volumeTier: 'Moderate',
    matchedService: 'Custom Brand Identity & Graphic Design',
    relevanceScore: 84,
    notes: 'Observed query for web design services.',
  },
  // AI-SUGGESTED Keyword Ideas (Clearly separated!)
  {
    id: 'st-5',
    query: 'digital workforce for small business ny',
    type: 'ai_suggested',
    isObserved: false,
    estimatedVolume: 90,
    relevance: 'Workforce Automation Offerings',
    volumeTier: 'Opportunity',
    matchedService: 'Digital Workforce & Business Automation',
    relevanceScore: 95,
    notes: 'AI Suggested: Aligns with approved digital workforce offerings, natural addition to upcoming post drafts.',
  },
  {
    id: 'st-6',
    query: 'ai receptionist automation consulting nyc',
    type: 'ai_suggested',
    isObserved: false,
    estimatedVolume: 65,
    relevance: 'Customer Intake & Scheduling',
    volumeTier: 'Emerging',
    matchedService: 'Digital Workforce & Business Automation',
    relevanceScore: 90,
    notes: 'AI Suggested: High-intent search for businesses seeking automated customer intake.',
  },
  {
    id: 'st-7',
    query: 'google maps citation audit new york',
    type: 'ai_suggested',
    isObserved: false,
    estimatedVolume: 45,
    relevance: 'Listing Health & Consistency',
    volumeTier: 'Opportunity',
    matchedService: 'Local Search Visibility & Citation Auditing',
    relevanceScore: 86,
    notes: 'AI Suggested: Specific technical phrase for B2B service firms.',
  },
];

export const INITIAL_SEARCH_INSIGHTS: SearchInsightMetrics = {
  reportingPeriod: 'Aug 17, 2026 – Sep 14, 2026 (Completed 28-day cycle)',
  lastSyncAt: '2026-09-17T08:00:00-04:00',
  lastSyncedAt: 'Sep 17, 2026, 8:00 AM EDT',
  reportingDelayNotice:
    'Google Business Profile performance data is subject to a standard 48-to-72-hour processing window. The displayed figures reflect the latest fully settled reporting cycle.',
  impressionsSearch: 1420,
  impressionsMaps: 890,
  callClicks: 34, // accurately labeled as call-button clicks, NOT customers
  websiteClicks: 118,
  directionRequests: null, // Unavailable because Arthur's Creatives is a service-area business with hidden physical address!
  comparison: {
    priorPeriodLabel: 'vs. July 20, 2026 – Aug 16, 2026',
    impressionsChangePercent: 18.5,
    websiteClicksChangePercent: 12.4,
    callClicksChangePercent: 6.2,
  },
  topSearchQueries: INITIAL_SEARCH_TERMS,
};

export const INITIAL_CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: 'dft-1',
    type: 'service_spotlight',
    typeLabel: 'Service Spotlight',
    title: 'Transforming Your Google Maps Visibility into Real Inquiries',
    body:
      "Is your Google Business Profile clearly communicating every service you offer? Many local businesses lose out on qualified inquiries simply because their secondary categories or service catalogs are outdated. At Arthur's Creatives, we continuously audit, optimize, and maintain your local listing so neighborhood clients find you first.",
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://arthurscreatives.com',
    createdAt: '2026-09-16T11:00:00-04:00',
    status: 'draft',
  },
  {
    id: 'dft-2',
    type: 'small_business_tip',
    typeLabel: 'Helpful Small-Business Tip',
    title: 'Why Service-Area Businesses Should Keep Dispatch Addresses Hidden',
    body:
      "If you meet clients at their location rather than operating a public walk-in storefront, keeping your physical dispatch address hidden protects your privacy while ensuring Google Maps routes inquiries to your designated service radius accurately. Consistency across your citations is key to sustaining map pack rankings.",
    callToAction: 'LEARN_MORE',
    ctaUrl: 'https://arthurscreatives.com',
    createdAt: '2026-09-15T09:30:00-04:00',
    status: 'saved',
  },
  {
    id: 'dft-3',
    type: 'approved_offer',
    typeLabel: 'Approved Offer',
    title: 'Complimentary Local Profile Health Inspection',
    body:
      "Take advantage of our complimentary profile health inspection this month. We run a comprehensive diagnostic of your listing attributes, service catalogs, and local discovery signals to identify clear, actionable improvements.",
    callToAction: 'GET_OFFER',
    ctaUrl: 'https://arthurscreatives.com',
    createdAt: '2026-09-14T14:15:00-04:00',
    status: 'draft',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '2026-09-17 08:15 AM EDT',
    action: 'Profile Inspector Run',
    details: 'Automated inspection detected 5 potential optimizations grounded in approved facts.',
    authorization: 'system_inspection',
    result: 'success',
    notes: 'Calculated Internal Profile Health Score: 78/100.',
  },
  {
    id: 'act-2',
    timestamp: '2026-09-17 08:00 AM EDT',
    action: 'Google Performance Sync',
    details: 'Synced 28-day metrics cycle from Google Business Profile reporting API.',
    authorization: 'system_inspection',
    result: 'success',
    notes: 'Direction requests recorded as unavailable (expected for hidden-address service-area business).',
  },
  {
    id: 'act-3',
    timestamp: '2026-09-16 04:45 PM EDT',
    action: 'Content Draft Created',
    details: 'Generated service spotlight draft using verified brand facts.',
    authorization: 'owner_manual_approval',
    result: 'success',
    notes: 'Saved to Content Drafts workspace for owner review.',
  },
  {
    id: 'act-4',
    timestamp: '2026-09-15 02:30 PM EDT',
    action: 'Approved Facts Confirmation',
    details: 'Owner confirmed baseline business facts, phone number, and service areas.',
    authorization: 'owner_manual_approval',
    result: 'success',
    notes: 'Baseline established as source of truth for workforce operations.',
  },
];

export const INITIAL_APP_SETTINGS: AppSettings = {
  ownerEmail: 'arthurscreatives@gmail.com',
  automationMode: 'review_first',
  isAutomationPaused: false,
  allowedAutopilotActions: ['profileDescription', 'services_text'],
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
    monthlyAiUsed: 14,
    dailyTaskQuota: 25,
    dailyTaskUsed: 3,
  },
  googleCloud: {
    projectId: 'arthurs-creatives-workforce',
    clientIdConfigured: false,
    businessProfileApiEnabled: false,
    apiApprovalStatus: 'pending_partner_review',
  },
  notifications: {
    externalDeliveryEnabled: false,
    notificationEmail: 'arthurscreatives@gmail.com',
  },
};

export const INITIAL_TASK_QUEUE: TaskQueueItem[] = [
  {
    id: 'task-insp-1',
    action: 'Daily Profile Consistency Inspection',
    reason: 'Scheduled morning audit comparing live Google profile against confirmed business facts.',
    category: 'inspection',
    createdAt: 'Sep 17, 2026, 09:00 AM EDT',
    scheduledTime: 'Sep 17, 2026, 09:00 AM EDT',
    completedAt: 'Sep 17, 2026, 09:00 AM EDT',
    approvalStatus: 'not_required',
    executionStatus: 'Completed',
    result: 'Audited 7 core fields. Discovered truncated description (142/750 chars) and 2 missing services.',
    targetField: 'profile_inspection',
    targetLabel: 'Live Google Profile',
    requiresOwnerApproval: false,
    deduplicationKey: 'insp_daily_2026-09-17',
  },
  {
    id: 'task-metrics-1',
    action: 'Sync Google Search Insight Metrics',
    reason: 'Retrieve customer actions, search impressions, and call button clicks from Google API.',
    category: 'metrics',
    createdAt: 'Sep 17, 2026, 09:01 AM EDT',
    scheduledTime: 'Sep 17, 2026, 09:01 AM EDT',
    completedAt: 'Sep 17, 2026, 09:01 AM EDT',
    approvalStatus: 'not_required',
    executionStatus: 'Completed',
    result: 'Recorded 1,420 search impressions (+12%) and 38 call clicks. Respecting monthly query reporting cadence.',
    targetField: 'search_metrics',
    targetLabel: 'Search & Maps Performance',
    requiresOwnerApproval: false,
    deduplicationKey: 'metrics_weekly_2026-09-17',
  },
  {
    id: 'task-repair-desc',
    action: 'Repair Profile Description Diff',
    reason: 'Expand truncated profile description (142 chars) to comprehensive 486-character overview grounded in Approved Facts.',
    category: 'repair',
    createdAt: 'Sep 17, 2026, 09:05 AM EDT',
    approvalStatus: 'pending_approval',
    executionStatus: 'Awaiting Approval',
    targetField: 'profileDescription',
    targetLabel: 'Profile Description',
    requiresOwnerApproval: true,
    isProtectedField: false,
    deduplicationKey: 'repair_desc_proposal',
  },
  {
    id: 'task-repair-srv',
    action: 'Catalog Missing Core Services',
    reason: 'Sync Digital Workforce Automation and Local Search Visibility from approved catalog to Google Services list.',
    category: 'repair',
    createdAt: 'Sep 17, 2026, 09:05 AM EDT',
    approvalStatus: 'pending_approval',
    executionStatus: 'Awaiting Approval',
    targetField: 'services',
    targetLabel: 'Services Catalog',
    requiresOwnerApproval: true,
    isProtectedField: true,
    deduplicationKey: 'repair_services_proposal',
  },
  {
    id: 'task-rev-reply',
    action: 'Customer Review Reply (Marcus Hayes)',
    reason: 'Customer left 2-star rating mentioning billing question. Flagged as sensitive complaint; reply drafted.',
    category: 'review',
    createdAt: 'Sep 17, 2026, 10:15 AM EDT',
    approvalStatus: 'pending_approval',
    executionStatus: 'Blocked',
    result: 'Blocked: Sensitive complaint detected. Autopilot reply held until Arthur explicitly approves.',
    targetField: 'customer_review',
    targetId: 'rev-3',
    targetLabel: 'Marcus Hayes Review (2 Stars)',
    requiresOwnerApproval: true,
    deduplicationKey: 'rev_reply_marcus_hayes',
  },
  {
    id: 'task-post-spotlight',
    action: 'Publish Google Business Update',
    reason: 'Weekly service spotlight post highlighting customized AI agent reception and booking for local businesses.',
    category: 'post',
    createdAt: 'Sep 17, 2026, 11:30 AM EDT',
    scheduledTime: 'Sep 18, 2026, 10:00 AM EDT',
    approvalStatus: 'approved',
    executionStatus: 'Queued',
    targetField: 'google_post',
    targetId: 'dft-1',
    targetLabel: 'Business Automation Spotlight Post',
    requiresOwnerApproval: false,
    deduplicationKey: 'post_weekly_spotlight_2026-09-18',
  },
];

export const INITIAL_ALERTS: WorkforceAlert[] = [
  {
    id: 'alt-rev-1',
    category: 'review_attention',
    title: 'Sensitive Review Requires Arthur’s Review',
    description: 'Marcus Hayes submitted a 2-star review mentioning a billing question. Automated reply is held in Blocked status until direct owner review.',
    severity: 'warning',
    createdAt: 'Sep 17, 2026, 10:15 AM EDT',
    actionLabel: 'Review Reply in Studio',
    actionType: 'view_review',
    targetTab: 'content_drafts',
    resolved: false,
    occurrenceCount: 1,
    lastOccurrenceAt: 'Sep 17, 2026, 10:15 AM EDT',
  },
  {
    id: 'alt-repair-1',
    category: 'repair_conflict',
    title: 'Repair Proposal Ready for Authorization',
    description: 'Profile Description diff proposal is waiting in queue. Review-first policy requires Arthur’s explicit approval before transmitting live changes.',
    severity: 'info',
    createdAt: 'Sep 17, 2026, 09:05 AM EDT',
    actionLabel: 'Inspect Diff Proposal',
    actionType: 'view_diff',
    targetTab: 'audit_repairs',
    resolved: false,
    occurrenceCount: 1,
    lastOccurrenceAt: 'Sep 17, 2026, 09:05 AM EDT',
  },
  {
    id: 'alt-cloud-1',
    category: 'google_reconnection',
    title: 'Google OAuth Verification Notice',
    description: 'Connected in verified developer sandbox mode. Production client secret requires Google Cloud Console verification before live public writes.',
    severity: 'info',
    createdAt: 'Sep 17, 2026, 09:00 AM EDT',
    actionLabel: 'View OAuth Setup',
    actionType: 'open_connect',
    targetTab: 'settings',
    resolved: false,
    occurrenceCount: 1,
    lastOccurrenceAt: 'Sep 17, 2026, 09:00 AM EDT',
  },
];

export const INITIAL_TODAYS_WORK: TodaysWorkSummary = {
  date: 'Sep 17, 2026',
  checkedItems: [
    'Connection Health: Google OAuth Sandbox verified; AI connection active (Vertex AI / Gemini fallback)',
    'Google Business Profile: Audited 7 core attributes against Approved Business Facts',
    'Customer Reviews: Retrieved 3 customer reviews; flagged 1 sensitive review for owner moderation',
    'Search Insights: Recorded 1,420 search impressions and 38 direct call clicks',
  ],
  changedAndVerified: [],
  publishedItems: [],
  needsApprovalItems: [
    'Repair: Profile Description expansion diff (486 characters, grounded in Approved Facts)',
    'Repair: Add 2 missing core services to Google Services catalog (Protected Field)',
    'Review Reply: Personalized response to Marcus Hayes (Sensitive complaint held for approval)',
  ],
  blockedOrFailedItems: [],
  totalTasksExecuted: 2,
  lastRunTimestamp: 'Sep 17, 2026, 09:01 AM EDT',
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

