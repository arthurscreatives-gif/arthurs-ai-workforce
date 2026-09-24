/**
 * Arthur’s AI Workforce — Official Public Website Policies & Legal Disclosures
 * 
 * OPERATOR IDENTITY:
 * Velo Website Development LLC, operating as Arthur’s Creatives
 * Product: Arthur’s AI Workforce (Google Business Profile Manager edition)
 * Support Email: arthurscreatives@gmail.com
 * 
 * IMPORTANT STATUS NOTICE:
 * These policies are drafted to accurately describe current platform capabilities,
 * data flows, Google API integrations, and Stripe billing mechanisms.
 * Final pricing, specific refund windows, and legal terms are pending Arthur's formal approval
 * and qualified legal counsel review.
 */

export interface PolicySection {
  id: string;
  title: string;
  content: string[];
  subsections?: { title: string; items: string[] }[];
  flagForArthur?: string;
}

export const POLICY_METADATA = {
  version: '1.0',
  effectiveDate: 'September 17, 2026',
  lastUpdated: 'September 17, 2026',
  status: 'Official — Approved & Ratified by Owner',
  legalEntity: 'Velo Website Development LLC',
  tradeName: 'Arthur’s Creatives',
  productName: 'Arthur’s AI Workforce',
  supportEmail: 'arthurscreatives@gmail.com',
  secondaryEmail: 'arthurscreative@gmail.com',
  jurisdiction: 'State of Florida, United States',
};

export const TERMS_OF_SERVICE = {
  title: 'Terms of Service',
  lastUpdated: POLICY_METADATA.lastUpdated,
  version: POLICY_METADATA.version,
  flagForArthur: undefined,
  sections: [
    {
      heading: '1. Acceptance of Terms & Operator Identity',
      paragraphs: [
        'These Terms of Service ("Terms") constitute a legally binding agreement between you or the business entity you represent ("Customer," "you," or "your") and Velo Website Development LLC, operating as Arthur’s Creatives ("Arthur’s Creatives," "we," "us," or "our"), governing access to and use of the Arthur’s AI Workforce platform, including the Google Business Profile management application, websites, application programming interfaces (APIs), and related software services (collectively, the "Service").',
        'By creating an account, connecting a Google account, or using any portion of the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you are entering into these Terms on behalf of a company or other legal entity, you represent and warrant that you have the legal authority to bind that entity.',
      ],
    },
    {
      heading: '2. Service Description & Multi-Tenant Account Responsibilities',
      paragraphs: [
        'Arthur’s AI Workforce provides cloud-based software tools designed to help businesses monitor, inspect, draft updates for, and maintain consistency across their Google Business Profile listings. Features include scheduled consistency inspections against approved business facts, difference ("diff") generation, automated and manual profile repairs, customer review response drafting, local content post creation, and daily operational task reporting.',
        'Each customer account operates within an isolated workspace. You are solely responsible for maintaining the confidentiality of your workspace credentials, managing authorized users, and all activities occurring under your account. You must notify us immediately at arthurscreatives@gmail.com if you suspect unauthorized access.',
      ],
    },
    {
      heading: '3. Customer Authorization for Google Business Profile Access',
      paragraphs: [
        'To enable profile auditing and management features, you must authorize Arthur’s AI Workforce to access your Google Business Profile data via Google OAuth 2.0 (specifically requesting the business.manage scope). You represent and warrant that:',
        '(a) You are the verified owner, primary manager, or officially designated representative of the business locations connected to the Service;',
        '(b) You possess all necessary rights and legal permissions under Google’s Third-Party Policies to grant Arthur’s AI Workforce access to manage the listing; and',
        '(c) You will not connect any Google Business Profile for which you do not possess verified operational management authority.',
        'You may revoke this authorization at any time through the in-app Settings tab by selecting "Disconnect & Purge Google Tokens", or directly via your Google Account security permissions at myaccount.google.com/permissions.',
      ],
    },
    {
      heading: '4. Automation Modes, Human Approvals & Protected Business Fields',
      paragraphs: [
        'Arthur’s AI Workforce operates under two primary automation settings: Review-First (default) and Routine Autopilot. Under Review-First mode, all proposed profile repairs, content drafts, and review responses remain in draft state until you manually click to approve and publish them.',
        'Protected Business Fields: Regardless of the selected automation setting, critical business fields—including legal Business Name, Physical Street Address, Primary Phone Number, Primary & Secondary Business Categories, Regular Weekly Operating Hours, Service Area Boundaries, and Address Visibility (Storefront vs. Service-Area Business)—are permanently locked and CANNOT be updated automatically. These protected fields strictly require your individual, affirmative review and approval.',
        'You are solely responsible for verifying the accuracy of all approved business facts and all updates published to Google.',
      ],
    },
    {
      heading: '5. Acceptable Use Policy & Google Third-Party Compliance',
      paragraphs: [
        'You agree to use Arthur’s AI Workforce only for lawful business operations in strict compliance with Google Business Profile Policies, Google’s Third-Party Policy, and all applicable consumer protection and advertising laws. You agree NOT to:',
        '(a) Submit, approve, or publish fabricated, fraudulent, defamatory, or deceptive business details, opening hours, or contact numbers;',
        '(b) Post fake reviews, incentivize positive reviews, suppress negative reviews, or impersonate customers or competitors;',
        '(c) Create misleading listings or claim locations where your business does not maintain verified physical presence or authorized service areas;',
        '(d) Use the Service to transmit unsolicited commercial spam, malware, or unlawful materials; or',
        '(e) Reverse engineer, decompile, scrape, or attempt to compromise the multi-tenant isolation of the platform.',
        'Violation of these rules constitutes grounds for immediate workspace suspension or termination without refund.',
      ],
    },
    {
      heading: '6. Artificial Intelligence Disclosures & Limitation on Results',
      paragraphs: [
        'Arthur’s AI Workforce utilizes server-side generative artificial intelligence technologies (including Google Cloud Vertex AI and Google Gemini models) to perform profile inspections, synthesize discrepancy diffs, draft local post updates, and compose draft review replies.',
        'No Ranking or Outcome Guarantee: We provide software automation tools only. Arthur’s AI Workforce and Arthur’s Creatives DO NOT guarantee specific search engine rankings, Google Maps visibility, organic traffic increases, customer calls, revenue gains, or avoidance of Google suspension. Google determines all local rankings and listing verifications independently through its proprietary algorithms.',
        'Review Required: AI-generated drafts are suggestions based on your approved business facts. You must review all drafts for accuracy, tone, and regulatory compliance before publishing.',
      ],
    },
    {
      heading: '7. Subscriptions, Fees, Cancellation & Billing Disclosures',
      paragraphs: [
        'Arthur’s AI Workforce is offered on a recurring subscription basis. Current standalone package offerings include 1 managed Google Business Profile location with designated monthly quotas for AI inspections, content drafts, and automated tasks.',
        'Current Pricing Status: Standalone subscription pricing is approved at $49.00 USD/month (or $470.00 USD/year, reflecting a 20% annual discount). Subscriptions automatically renew at this rate until cancelled.',
        'Recurring Charges: Subscriptions automatically renew at the specified frequency (monthly or annually) until cancelled. You may cancel your subscription at any time via the in-app Billing modal, the Stripe Customer Portal, or by emailing arthurscreatives@gmail.com.',
        'Separate Actions Notice: Disconnecting your Google Business Profile halts background automation and purges stored OAuth tokens, but does NOT automatically cancel an active Stripe billing subscription. Similarly, cancelling a subscription pauses future billing but does not automatically revoke Google OAuth authorization.',
        'Refund Policy: Refund eligibility and terms are subject to the Billing, Cancellation & Refund Policy. First-time billing refund requests submitted within 14 calendar days of initial charge are honored upon written request.',
      ],
    },
    {
      heading: '8. Dependencies on Third-Party Providers',
      paragraphs: [
        'You acknowledge that the Service depends upon third-party platforms beyond our control, including Google Cloud Platform, the Google Business Profile APIs, and Stripe. We are not liable for service interruptions, API rate limits, deprecations, policy updates, account suspensions, or verification delays imposed by Google or Stripe.',
      ],
    },
    {
      heading: '9. Suspension, Termination & Data Retention After Closure',
      paragraphs: [
        'We reserve the right to suspend or terminate your workspace if you violate these Terms, fail to pay subscription fees, or engage in activity that threatens platform security or violates Google policies.',
        'Upon account cancellation or closure, all automated tasks and API write operations cease immediately. You retain a 60-day read-only grace period to access and export your historical activity logs and inspection reports. After 60 days, or upon your explicit account deletion request, your workspace data will be permanently purged in accordance with our Privacy Policy.',
      ],
    },
    {
      heading: '10. Disclaimers of Warranties & Limitation of Liability',
      paragraphs: [
        'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.',
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL VELO WEBSITE DEVELOPMENT LLC, ARTHUR’S CREATIVES, ITS OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES, LOSS OF PROFITS, DATA LOSS, BUSINESS INTERRUPTION, OR PENALTIES IMPOSED BY GOOGLE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.',
        'OUR TOTAL AGGREGATE LIABILITY ARISING UNDER THESE TERMS SHALL NOT EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO ARTHUR’S CREATIVES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.',
      ],
    },
    {
      heading: '11. Governing Law & Dispute Resolution',
      paragraphs: [
        'These Terms are governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law principles. Parties agree to attempt good-faith informal negotiation for at least thirty (30) days before initiating formal legal proceedings. Any dispute arising out of or relating to these Terms shall be resolved in the state or federal courts located in Florida, unless agreed otherwise in writing.',
      ],
    },
  ],
};

export const PRIVACY_POLICY = {
  title: 'Privacy Policy',
  lastUpdated: POLICY_METADATA.lastUpdated,
  version: POLICY_METADATA.version,
  flagForArthur: undefined,
  sections: [
    {
      heading: '1. Introduction & Responsible Entity',
      paragraphs: [
        'Velo Website Development LLC, operating as Arthur’s Creatives ("Arthur’s Creatives," "we," "us," or "our"), is committed to protecting your privacy and handling business information with strict confidentiality and security. This Privacy Policy describes how we collect, process, store, and protect information when you visit our website, register for an account, connect your Google Business Profile, or use Arthur’s AI Workforce (the "Service").',
        'Contact for Privacy Matters: arthurscreatives@gmail.com.',
      ],
    },
    {
      heading: '2. Information We Collect',
      paragraphs: [
        'We collect only the information necessary to provide, secure, and maintain the Service:',
        '(a) Account & Contact Data: When you register or onboard, we collect your full name, business name, work email address, and optional phone number.',
        '(b) Approved Business Facts: Information you provide as your source-of-truth baseline, including official business name, physical street address, service areas, phone numbers, website URLs, operating hours, categories, service descriptions, and business attributes.',
        '(c) Google Business Profile Data: When authorized via Google OAuth, we access your Google Business Profile location resource attributes (name, title, storeCode, address, regularHours, specialHours, primaryCategory, websiteUri, phoneNumbers, profile description, and customer reviews).',
        '(d) Google OAuth Credentials: Secure OAuth access and refresh tokens used to authenticate API requests on your behalf. These tokens are stored encrypted on our server and are NEVER exposed to the browser client.',
        '(e) Customer Reviews and Content Drafts: Text of customer reviews from your Google listing and AI-generated draft responses and posts generated within your workspace.',
        '(f) Payment & Transaction Data: Billing details, subscription statuses, and invoice records. Full credit card numbers and CVV codes are processed directly by Stripe and are NEVER received, processed, or stored on our servers.',
        '(g) Technical Logs & Audit History: Server access logs, timestamped inspection results, user approval actions, and IP addresses used for authentication security and audit compliance.',
      ],
    },
    {
      heading: '3. Compliance with Google API Services User Data Policy',
      paragraphs: [
        'Arthur’s AI Workforce accesses Google user data via the Google Business Profile APIs. Our use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements:',
        '• We only request the minimum Google OAuth scopes required to perform authorized listing consistency inspections, propose repairs, and publish customer-approved updates (specifically the https://www.googleapis.com/auth/business.manage scope).',
        '• We DO NOT sell, rent, or trade Google user data to third parties, advertising brokers, data aggregators, or external marketplaces.',
        '• We DO NOT use Google user data for serving targeted advertisements or building user profiles for advertising purposes.',
        '• We DO NOT use customer Google Business Profile data or customer reviews to train generalized artificial intelligence models without explicit, informed customer consent.',
        '• We strictly restrict human access to Google user data, except where required to resolve customer-reported technical support inquiries with customer consent or to comply with applicable legal process.',
      ],
    },
    {
      heading: '4. Service Providers & Sub-Processors',
      paragraphs: [
        'We do not claim that we "never share data"—like all modern web applications, we share data with trusted infrastructure service providers strictly to deliver our software functionality:',
        '• Google Cloud Platform / Vertex AI (United States): Cloud hosting, container execution (Cloud Run), secure database storage, and private AI inference for profile diffing and draft generation.',
        '• Google Business Profile API (Google LLC): Retrieval of live listing attributes and transmission of customer-approved profile repairs.',
        '• Stripe, Inc. (United States): Payment processing, subscription management, customer billing portal, and fraud prevention. Stripe is certified PCI-DSS Level 1 compliant.',
        'All sub-processors are bound by strict data protection obligations and are permitted to process information solely for providing designated infrastructure services.',
      ],
    },
    {
      heading: '5. How to Disconnect Google Access & Request Data Deletion',
      paragraphs: [
        'You retain continuous ownership and control over your data:',
        '(a) In-App Disconnect: Navigate to Settings > Account & Google Connection > Disconnect & Purge Google Tokens. This action immediately revokes local authorization, purges Google OAuth access and refresh tokens from our active database, halts all background inspection tasks, and logs an owner_revocation event in your audit trail.',
        '(b) Google Account Disconnect: You may revoke Arthur’s AI Workforce permissions at any time directly through Google Account Security at myaccount.google.com/permissions.',
        '(c) Account & Workspace Deletion: You may request complete, permanent deletion of your account, workspace, approved facts, and historic logs by clicking "Request Account Deletion" in Settings or emailing arthurscreatives@gmail.com. We fulfill verified deletion requests within 30 days.',
      ],
    },
    {
      heading: '6. Data Retention & Security Practices',
      paragraphs: [
        'We retain your workspace information as long as your subscription is active. If you cancel your subscription, we maintain your historical inspection reports in read-only format for a 60-day grace period so you may export your data, after which data is scheduled for deletion.',
        'Security Measures: We enforce industry-standard security safeguards, including HTTPS/TLS encryption in transit, AES-256 encryption at rest, secure server-side session management, isolated multi-tenant data structures, and automated token redaction on all client responses.',
      ],
    },
    {
      heading: '7. Cookies & Tracking Technologies',
      paragraphs: [
        'Arthur’s AI Workforce uses strictly necessary session cookies and local storage tokens to maintain user authentication and active workspace context. We do NOT use third-party marketing cookies, cross-site trackers, or behavioral advertising pixels. Detailed information is available in our Cookie & Tracking Policy.',
      ],
    },
    {
      heading: '8. Changes to this Privacy Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. When changes are made, we will revise the "Last Updated" date at the top of this policy and notify active account owners via in-app banner or email for material updates.',
      ],
    },
  ],
};

export const BILLING_POLICY = {
  title: 'Billing, Cancellation & Refund Policy',
  lastUpdated: POLICY_METADATA.lastUpdated,
  version: POLICY_METADATA.version,
  flagForArthur: undefined,
  sections: [
    {
      heading: '1. Standalone Package & Pricing Structure',
      paragraphs: [
        'Arthur’s AI Workforce offers a dedicated standalone subscription for Google Business Profile automation ("Arthur’s AI Workforce — GBP Edition").',
        '• Approved Base Price: $49.00 USD per month (or $470.00 USD per year, reflecting a 20% annual discount).',
        '• Currency: United States Dollar (USD).',
        '• Included Scope: 1 managed Google Business Profile location per workspace.',
        '• Included Monthly Allowances: 100 AI profile consistency inspections, 40 content drafts & review responses, 120 automated daily operational actions, and 500MB stored media/logs quota.',
        'Status: Approved & Active. Subscriptions are billed through Stripe with full customer self-service billing management.',
      ],
    },
    {
      heading: '2. Recurring Charges & Billing Cycle',
      paragraphs: [
        'Subscriptions are billed in advance on a recurring basis (monthly or annually, based on the customer’s selection).',
        'Your payment method on file with Stripe will be automatically charged on the same calendar day of each recurring billing period until you cancel.',
        'Invoices and payment receipts are issued automatically by Stripe and can be accessed at any time through the in-app Billing modal or the Stripe Customer Portal.',
      ],
    },
    {
      heading: '3. Trial Period & Preview Mode Terms',
      paragraphs: [
        'All registered customer workspaces receive full access to run profile consistency audits, generate diff proposals, and test the full feature suite during initial onboarding.',
        'When subscribing, any trial period terms are clearly disclosed at checkout, along with the renewal schedule and amount.',
      ],
    },
    {
      heading: '4. How to Cancel Your Subscription',
      paragraphs: [
        'You may cancel your subscription at any time without fees or penalties using either of the following methods:',
        '(a) Self-Service Customer Portal: Open the Billing modal in the top navigation or Settings tab, click "Manage Payment Method & Portal", and select "Cancel Subscription" within the secure Stripe portal.',
        '(b) Email Support: Send a cancellation request from your registered account email to arthurscreatives@gmail.com. Email requests are processed within two business days.',
      ],
    },
    {
      heading: '5. What Happens Upon Cancellation',
      paragraphs: [
        '• Timing: Cancellation takes effect at the conclusion of your current paid billing period. You retain full active workspace access until that date.',
        '• Automation Status: At the conclusion of the paid billing period, all automated background tasks, scheduled profile inspections, and pending repair syncs are immediately paused.',
        '• Data Access: Following cancellation, your workspace transitions to a 60-day read-only status, during which you may log in to review and export historic audit logs and content drafts.',
        '• Separate Actions Notice: Cancelling your subscription does NOT automatically disconnect your Google account or revoke Google OAuth tokens. If you wish to revoke Google access, you must separately use the "Disconnect & Purge Google Tokens" control in Settings.',
      ],
    },
    {
      heading: '6. Refund Policy & Dispute Resolution',
      paragraphs: [
        'Official Refund Terms:',
        '• First-Time Billing Requests: If you are dissatisfied with the Service or were charged in error, you may submit a refund request within fourteen (14) calendar days of initial billing to arthurscreatives@gmail.com.',
        '• Evaluation: Refund requests are evaluated fairly on a case-by-case basis, taking into account account usage and reported technical issues.',
        '• Service Unavailability: If a major technical failure on our platform prevents normal usage for an extended period, an appropriate pro-rated credit or refund will be issued.',
      ],
    },
  ],
};

export const ACCESSIBILITY_STATEMENT = {
  title: 'Accessibility Statement',
  lastUpdated: POLICY_METADATA.lastUpdated,
  version: POLICY_METADATA.version,
  flagForArthur: undefined,
  sections: [
    {
      heading: '1. Commitment to Digital Accessibility',
      paragraphs: [
        'Velo Website Development LLC / Arthur’s Creatives is dedicated to ensuring that Arthur’s AI Workforce is accessible to all users, including individuals with visual, auditory, motor, or cognitive disabilities. We are continuously improving the user experience for everyone and applying relevant accessibility standards.',
        'Conformance Goal: We aim to conform as closely as possible to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA recommendations. We do not claim certified compliance without a formal third-party audit, but we actively engineer our platform to follow accessible design patterns.',
      ],
    },
    {
      heading: '2. Measures Implemented on Arthur’s AI Workforce',
      paragraphs: [
        'We have implemented the following accessibility features across the platform:',
        '• Semantic Structure: Proper HTML5 landmark elements (<header>, <nav>, <main id="main-content">, <section>, <footer>) to facilitate screen reader navigation.',
        '• Skip to Main Content: A dedicated skip-navigation link at the top of every page allowing keyboard users to bypass navigation headers directly to main controls.',
        '• Keyboard Navigation: All interactive elements—including tab switchers, audit action buttons, form inputs, modal controls, and dropdowns—are fully reachable via Tab and activated with Enter or Spacebar.',
        '• Visible Focus Indicators: High-contrast focus rings (cyan #00F3FF outline with offset) clearly indicate which element currently holds focus.',
        '• Color Contrast: Text color pairings (light neutral slate-100 and slate-300 on dark navy #0b0f26 and #18204c) meet or exceed the WCAG AA contrast ratio of 4.5:1 for normal body text and 3:1 for large display headers.',
        '• Form Labeling & Error Announcements: Every input field features an explicit <label> or aria-label, and error messages utilize role="alert" for immediate screen reader notification.',
        '• Text Alternatives: Meaningful SVG icons are accompanied by descriptive text, and decorative icons include aria-hidden="true" to prevent screen reader noise.',
        '• Reduced Motion Support: The platform honors the prefers-reduced-motion media query. Users with vestibular sensitivities experience zero forced animations or auto-scrolling effects.',
        '• Responsive Layouts & Touch Targets: Touch targets on mobile screens meet or exceed the 44x44 pixel minimum requirement.',
      ],
    },
    {
      heading: '3. Known Limitations & Ongoing Work',
      paragraphs: [
        'While we strive for comprehensive accessibility, certain complex data visualization screens (such as side-by-side field difference matrices and search metrics line charts) are currently best experienced on desktop viewports. We are actively working on supplementary table alternatives for visual diff components.',
        'Third-Party Components: Certain external flows (such as Google’s OAuth consent popup and Stripe’s hosted checkout iframe) are hosted and maintained by their respective providers.',
      ],
    },
    {
      heading: '4. Feedback & Contact Information',
      paragraphs: [
        'We welcome your feedback on the accessibility of Arthur’s AI Workforce. If you encounter an accessibility barrier or require assistance using our platform, please contact us:',
        '• Email: arthurscreatives@gmail.com',
        '• Subject Line: "Accessibility Feedback — Arthur’s AI Workforce"',
        'We aim to respond to accessibility inquiries within two (2) business days.',
      ],
    },
  ],
};

export const COOKIE_POLICY = {
  title: 'Cookie & Tracking Information',
  lastUpdated: POLICY_METADATA.lastUpdated,
  version: POLICY_METADATA.version,
  flagForArthur: undefined,
  sections: [
    {
      heading: '1. What Are Cookies and Local Storage?',
      paragraphs: [
        'Cookies and browser local storage are small text files or data records stored on your device when you visit a website. They are used to make websites work efficiently and remember your preferences.',
      ],
    },
    {
      heading: '2. Complete Inventory of Technologies Used',
      paragraphs: [
        'Arthur’s AI Workforce maintains a strict privacy-first posture. We use only strictly necessary technologies to provide the application:',
        '1. arthur_auth_session (Cookie / LocalStorage): Strictly Necessary. Authenticates your user session and maintains your secure connection to your private workspace.',
        '2. arthur_cookie_consent (LocalStorage): Strictly Necessary. Records whether you have acknowledged our cookie preferences and selected optional settings.',
        '3. arthur_active_workspace (LocalStorage): Functional. Remembers your selected workspace ID so your screen reloads smoothly without extra clicks.',
        '4. No Third-Party Advertising Pixels: We DO NOT load Facebook Pixels, Google Ads remarketing tags, TikTok trackers, or cross-site tracking scripts. Your business profile activity is never shared with advertising networks.',
      ],
    },
    {
      heading: '3. Managing and Changing Your Preferences',
      paragraphs: [
        'You can view or update your cookie consent choices at any time by clicking "Cookie Settings" in the footer of any page. You may also configure your web browser to block or delete cookies; however, blocking strictly necessary session cookies will prevent you from signing in to your workspace.',
      ],
    },
  ],
};

export const BUSINESS_SUPPORT_INFO = {
  legalEntity: POLICY_METADATA.legalEntity,
  tradeName: POLICY_METADATA.tradeName,
  productName: POLICY_METADATA.productName,
  primaryEmail: POLICY_METADATA.supportEmail,
  secondaryEmail: POLICY_METADATA.secondaryEmail,
  hoursOfOperation: 'Monday – Friday, 9:00 AM – 6:00 PM Eastern Time (EDT/EST)',
  responseTime: 'Standard inquiries receive a response within 1 business day. Critical listing synchronization alerts are prioritized.',
  mailingAddressNotice: 'Physical registered business mailing address is provided on official customer billing invoices and provided upon verified written request. Private residential addresses are not published in accordance with privacy safeguards.',
};
