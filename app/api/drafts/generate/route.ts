import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { ApprovedBusinessFacts, ContentDraft } from '@/types/business-profile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: ContentDraft['type'] = body.type || 'service_spotlight';
    const approvedFacts: ApprovedBusinessFacts = body.approvedFacts;
    const customPrompt: string = body.customPrompt || '';

    if (!approvedFacts) {
      return NextResponse.json({ error: 'Missing approvedFacts' }, { status: 400 });
    }

    const ai = getGeminiClient();

    let typeLabel = 'Service Spotlight';
    if (type === 'small_business_tip') typeLabel = 'Helpful Small-Business Tip';
    else if (type === 'project_highlight') typeLabel = 'Owner Project Highlight';
    else if (type === 'approved_offer') typeLabel = 'Approved Offer';

    let defaultCta: ContentDraft['callToAction'] = 'LEARN_MORE';
    if (type === 'approved_offer') defaultCta = 'GET_OFFER';

    // Rule-based high quality fallback draft
    let fallbackDraft: ContentDraft = {
      id: `dft-${Date.now()}`,
      type,
      typeLabel,
      title: `${approvedFacts.businessName} — ${typeLabel}`,
      body:
        type === 'service_spotlight'
          ? `Discover how Arthur's Creatives helps local businesses expand their Google Search and Maps presence. From cataloging your verified services to setting up intelligent digital workforce automation, we keep your business visible and responsive.`
          : type === 'small_business_tip'
          ? `Small Business Tip: Ensure your Google Business Profile categories and operating hours match your confirmed schedule. Inconsistent hours lead to lost phone calls on weekends.`
          : type === 'project_highlight'
          ? `Recent project highlight: We completed a local search visibility and profile optimization package, enhancing service clarity and streamlining customer intake.`
          : `Approved Offer: Take advantage of our complimentary profile health inspection this month. We diagnose missing attributes and keyword opportunities for your local presence.`,
      callToAction: defaultCta,
      ctaUrl: approvedFacts.websiteUri,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    if (ai) {
      try {
        const prompt = `You are the Content Analyst for Arthur's AI Workforce at Arthur's Creatives.
Write a Google Business Profile post draft of type "${typeLabel}".

Strict Rules:
- Ground every statement strictly in the provided Approved Business Facts.
- Never invent customer numbers, fake prices, guarantees, or capabilities not in the facts.
- Use Arthur's Creatives brand voice: professional, direct, craftsmanship-focused, no marketing hype.
- Suitable for Google Business Profile post format (under 150 words / 1000 characters).
- Mention verified services naturally.
${customPrompt ? `Owner Note: ${customPrompt}` : ''}

Approved Facts:
Business Name: ${approvedFacts.businessName}
Description: ${approvedFacts.description}
Services: ${approvedFacts.services.map((s) => s.name).join(', ')}
Approved Offers: ${approvedFacts.approvedOffers.map((o) => `${o.title}: ${o.details}`).join('; ')}
Website: ${approvedFacts.websiteUri}
Brand Voice: ${approvedFacts.brandVoice}

Respond with a JSON object containing:
{
  "title": "A concise, engaging headline",
  "body": "The body text of the post draft",
  "callToAction": "LEARN_MORE" (or "GET_OFFER" or "CALL_NOW")
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const textOutput = response.text || '';
        const parsed = JSON.parse(textOutput);
        if (parsed.title && parsed.body) {
          fallbackDraft = {
            id: `dft-${Date.now()}`,
            type,
            typeLabel,
            title: parsed.title,
            body: parsed.body,
            callToAction: parsed.callToAction || defaultCta,
            ctaUrl: approvedFacts.websiteUri,
            createdAt: new Date().toISOString(),
            status: 'draft',
          };
        }
      } catch (aiErr) {
        console.error('Gemini draft generation error, using grounded fallback:', aiErr);
      }
    }

    return NextResponse.json({ draft: fallbackDraft });
  } catch (error) {
    console.error('Draft generation endpoint error:', error);
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
  }
}
