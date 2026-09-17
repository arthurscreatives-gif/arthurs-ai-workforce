import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  checkDailyQuota,
  recordUsage,
  getConfiguredModel,
} from '@/lib/gemini';
import { ApprovedBusinessFacts, ContentDraft } from '@/types/business-profile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: ContentDraft['type'] = body.type || 'service_spotlight';
    const approvedFacts: ApprovedBusinessFacts = body.approvedFacts;
    const focusTopic: string = body.focusTopic || '';

    if (!approvedFacts) {
      return NextResponse.json({ error: 'Missing approved business facts' }, { status: 400 });
    }

    const quota = checkDailyQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'Daily AI generation limit reached. Limit resets at midnight EDT.' },
        { status: 429 }
      );
    }

    let typeLabel = 'Service Spotlight';
    let defaultCta: ContentDraft['callToAction'] = 'LEARN_MORE';
    if (type === 'small_business_tip') {
      typeLabel = 'Small-Business Tip';
      defaultCta = 'LEARN_MORE';
    } else if (type === 'project_highlight') {
      typeLabel = 'Project Highlight';
      defaultCta = 'LEARN_MORE';
    } else if (type === 'approved_offer') {
      typeLabel = 'Approved Offer';
      defaultCta = 'GET_OFFER';
    }

    // High quality deterministic draft
    let draftTitle = `${approvedFacts.businessName}: ${typeLabel}`;
    let draftBody = `Discover how Arthur's Creatives empowers local businesses through automated AI workforces and profile visibility. From customer intake agents to live search optimization, we keep your business responsive 24/7.`;

    if (type === 'small_business_tip') {
      draftTitle = `Local Search Tip: Keep Business Attributes Updated`;
      draftBody = `Tip for New York business owners: Keeping your Google Business Profile hours and service areas accurate prevents missed leads during peak search hours. Ensure your core services are clearly cataloged.`;
    } else if (type === 'project_highlight') {
      draftTitle = `Recent Launch: AI Workforce Deployment for Local Intake`;
      draftBody = `We recently deployed an automated intake agent and optimized search presence for a local client, reducing missed customer inquiries and providing instant responses on Google Maps.`;
    } else if (type === 'approved_offer') {
      draftTitle = `Complimentary Google Business Profile Health Inspection`;
      draftBody = `Ready to audit your local presence? Receive a comprehensive profile health review identifying missing attributes, hidden opportunities, and approved digital workforce capabilities.`;
    }

    const ai = getGeminiClient();
    const model = getConfiguredModel();

    if (ai) {
      try {
        const prompt = `You are Arthur’s AI Workforce Content Analyst.
Write a concise Google Business Profile post draft.

POST TYPE: "${typeLabel}"
${focusTopic ? `FOCUS TOPIC: "${focusTopic}"` : ''}

APPROVED FACTS:
- Business Name: ${approvedFacts.businessName}
- Description: ${approvedFacts.description}
- Services: ${approvedFacts.services.map((s) => s.name).join(', ')}
- Website: ${approvedFacts.websiteUri}
- Offers: ${approvedFacts.approvedOffers.map((o) => `${o.title}: ${o.details}`).join('; ')}
- Brand Voice: ${approvedFacts.brandVoice}

STRICT CONSTRAINTS:
1. Under 150 words (compact and readable on mobile Google Maps cards).
2. Never invent fake statistics, guarantees, or prices.
3. Use Arthur's Creatives brand tone: polished, professional, authoritative, no fluffy jargon.
4. Output JSON schema:
{
  "title": "<compelling headline, under 60 characters>",
  "body": "<post body text>",
  "suggestedCta": "LEARN_MORE" | "GET_OFFER" | "CALL_NOW"
}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 500,
          },
        });

        recordUsage(300);

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.title) draftTitle = parsed.title;
        if (parsed.body) draftBody = parsed.body;
        if (parsed.suggestedCta) defaultCta = parsed.suggestedCta;
      } catch (err) {
        console.error('AI post generation error:', err);
      }
    }

    const draft: ContentDraft = {
      id: `dft-${Date.now()}`,
      type,
      typeLabel,
      title: draftTitle,
      body: draftBody,
      callToAction: defaultCta,
      ctaUrl: approvedFacts.websiteUri,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    return NextResponse.json({
      success: true,
      draft,
      taskState: 'Ready',
    });
  } catch (error) {
    console.error('Failed to create post draft:', error);
    return NextResponse.json({ error: 'Failed to create business post' }, { status: 500 });
  }
}
