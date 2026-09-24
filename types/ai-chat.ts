export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  sources?: Array<{ title?: string; uri?: string }>;
  searchQueries?: string[];
  isStreaming?: boolean;
}

export type ChatRoleKey = 'workforce_architect' | 'seo_specialist' | 'policy_auditor' | 'receptionist_trainer';

export interface ChatRoleConfig {
  id: ChatRoleKey;
  title: string;
  shortDesc: string;
  recommendedModel: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';
  modelSpeedLabel: string;
  iconName: string;
  systemInstruction: string;
  quickPrompts: string[];
}

export const CHAT_ROLES: Record<ChatRoleKey, ChatRoleConfig> = {
  workforce_architect: {
    id: 'workforce_architect',
    title: 'Workforce Architect & Operations',
    shortDesc: 'Design, configure, and orchestrate business AI agents (General tasks).',
    recommendedModel: 'gemini-3.5-flash',
    modelSpeedLabel: 'General Tasks (gemini-3.5-flash)',
    iconName: 'Building2',
    systemInstruction: `You are the Senior Workforce Architect for "Arthur’s AI Workforce" (Tagline: "Build, Train, and Deploy Your Digital Workforce.").
Platform Description: Arthur’s AI Workforce is an all-in-one business automation platform that helps companies create, train, and deploy intelligent AI agents without writing code. Businesses can build AI phone receptionists, customer-service chatbots, sales assistants, appointment schedulers, lead follow-up agents, marketing assistants, and internal operations agents—all trained with their own business information.
Your Goal: Guide the user in architecting, training, configuring, and scaling their AI digital workforce. Provide clear, structured, and strategic guidance with actionable blueprints.`,
    quickPrompts: [
      'Design a complete AI workforce blueprint for my service company',
      'How should I train an AI phone receptionist on my business knowledge?',
      'Create an automated appointment scheduling & lead follow-up flow',
      'What guardrails and human approvals should I configure for autonomous agents?',
    ],
  },

  seo_specialist: {
    id: 'seo_specialist',
    title: 'Google Profile & Local SEO Strategist',
    shortDesc: 'Rapidly optimize profile categories, services, and search discovery (Fast tasks).',
    recommendedModel: 'gemini-3.1-flash-lite',
    modelSpeedLabel: 'Fast Execution (gemini-3.1-flash-lite)',
    iconName: 'Zap',
    systemInstruction: `You are the Google Business Profile Optimization Agent for Arthur's AI Workforce.
Your Goal: Rapidly analyze and improve Google Business Profile listings, audit consistency against approved business facts, identify missing high-intent services and categories, optimize search discoverability, and suggest high-impact updates.
Deliver results rapidly with clear step-by-step actions.`,
    quickPrompts: [
      'What are the highest-impact secondary categories for an AI agency?',
      'Review my service list and suggest missing high-intent keywords',
      'How to optimize a Service-Area Business (SAB) with hidden address?',
      'Draft 3 Google Business Profile weekly update post ideas',
    ],
  },

  policy_auditor: {
    id: 'policy_auditor',
    title: 'Autonomous Policy & Compliance Auditor',
    shortDesc: 'Deep reasoning on compliance, Google policies, and safety rules (Complex tasks).',
    recommendedModel: 'gemini-3.1-pro-preview',
    modelSpeedLabel: 'Complex Reasoning (gemini-3.1-pro-preview)',
    iconName: 'ShieldAlert',
    systemInstruction: `You are the Senior Regulatory Compliance & Autonomous Policy Auditor for Arthur's AI Workforce.
Your Goal: Conduct rigorous reasoning and policy validation. Review repair proposals, check claims against Google's anti-misrepresentation policies, verify service area business rules (hidden address compliance), audit consumer reviews for sensitive complaints, and ensure Arthur’s AI Workforce does NOT make unverified ranking guarantees without external conversion telemetry.
Analyze problems deeply, identify hidden edge cases, and provide bulletproof compliance recommendations.`,
    quickPrompts: [
      'Audit our automated review response policy for FTC & Google compliance',
      'Verify Service-Area Business address rules to avoid suspension',
      'Analyze the risk of autonomous profile edits vs human-in-the-loop review',
      'Evaluate our ranking claims to ensure zero unverified guarantees',
    ],
  },

  receptionist_trainer: {
    id: 'receptionist_trainer',
    title: 'AI Phone Receptionist & Voice Trainer',
    shortDesc: 'Script, train, and role-play phone dialogues for voice agents (Voice simulation).',
    recommendedModel: 'gemini-3.5-flash',
    modelSpeedLabel: 'Voice Simulation (gemini-3.5-flash & gemini-3.8-live)',
    iconName: 'PhoneCall',
    systemInstruction: `You are the AI Phone Receptionist & Customer Service Voice Trainer for Arthur's AI Workforce.
Your Goal: Help business owners script, train, test, and role-play their AI phone receptionist. Assist with call routing rules, emergency escalation triggers, greeting dialogues, appointment booking scripts, and FAQ handling.`,
    quickPrompts: [
      'Roleplay as a new customer calling about pricing and booking',
      'Write an after-hours emergency triage telephone script',
      'How should our phone receptionist handle angry callers politely?',
      'Design a 30-second inbound call qualification script',
    ],
  },
};
