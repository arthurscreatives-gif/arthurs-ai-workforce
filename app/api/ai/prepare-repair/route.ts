import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  checkDailyQuota,
  recordUsage,
  getConfiguredModel,
} from '@/lib/gemini';
import {
  ApprovedBusinessFacts,
  InspectorFinding,
  RepairProposal,
} from '@/types/business-profile';

// Protected fields that must ALWAYS require individual owner approval
const PROTECTED_FIELDS = new Set([
  'businessName',
  'address',
  'isAddressVisible',
  'primaryPhone',
  'websiteUri',
  'primaryCategory',
  'additionalCategories',
  'regularHours',
  'serviceAreas',
  'approvedOffers',
  'delete',
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const finding: InspectorFinding = body.finding;
    const approvedFacts: ApprovedBusinessFacts = body.approvedFacts;
    const currentValue: string = body.currentValue || '';

    if (!finding || !approvedFacts) {
      return NextResponse.json({ error: 'Missing finding or approved business facts' }, { status: 400 });
    }

    const quota = checkDailyQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'Daily AI generation limit reached. Please review existing drafts or try again tomorrow.' },
        { status: 429 }
      );
    }

    const isProtected = PROTECTED_FIELDS.has(finding.field);
    const ai = getGeminiClient();
    const model = getConfiguredModel();

    let proposedValue = approvedFacts.description;
    let reason = 'Aligns live profile with verified owner business facts.';
    let evidence = 'Directly verified from Approved Business Facts.';

    if (finding.field === 'profileDescription') {
      proposedValue = approvedFacts.description;
      reason = 'Expands profile overview to detail digital workforce automation and verified consulting services.';
      evidence = 'Owner-confirmed description in Approved Business Facts.';
    } else if (finding.field === 'services') {
      const allServices = approvedFacts.services.map((s) => s.name).join(', ');
      proposedValue = allServices;
      reason = 'Catalogs complete roster of verified services for local search discovery.';
      evidence = 'Approved services catalog.';
    } else if (finding.field === 'additionalCategories') {
      proposedValue = [approvedFacts.primaryCategory, ...approvedFacts.additionalCategories].join(', ');
      reason = 'Extends business reach across verified categories.';
      evidence = 'Approved categories in business facts.';
    }

    if (ai) {
      try {
        const prompt = `You are Arthur’s AI Workforce Repair Worker.
Prepare a structured repair proposal for the following issue detected on Arthur's Creatives Google Business Profile.

FINDING DETAILS:
- Field: "${finding.field}" (${finding.fieldLabel})
- Issue: "${finding.issue}"
- Evidence: "${finding.evidence}"
- Proposed Action: "${finding.proposedAction}"
- Current Live Value: "${currentValue}"

APPROVED BUSINESS FACTS:
- Description: "${approvedFacts.description}"
- Services: ${JSON.stringify(approvedFacts.services.map((s) => s.name))}
- Categories: ${approvedFacts.primaryCategory}, ${approvedFacts.additionalCategories.join(', ')}
- Brand Voice: "${approvedFacts.brandVoice}"

INSTRUCTIONS:
1. Propose exact wording or value that resolves the finding.
2. Ground every single word strictly in the Approved Business Facts.
3. Keep descriptions under 750 characters.
4. Provide a clear 1-sentence reason.
5. Provide the exact evidence used.
6. Respond with JSON matching:
{
  "proposedValue": "<string of exact proposed value>",
  "reason": "<clear explanation>",
  "evidence": "<specific evidence citation>"
}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 500,
          },
        });

        recordUsage(250);

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.proposedValue) {
          proposedValue = parsed.proposedValue;
        }
        if (parsed.reason) {
          reason = parsed.reason;
        }
        if (parsed.evidence) {
          evidence = parsed.evidence;
        }
      } catch (err) {
        console.error('AI repair proposal generation error, using deterministic fallback:', err);
      }
    }

    const proposal: RepairProposal = {
      id: `prop-${Date.now()}`,
      field: finding.field,
      fieldLabel: finding.fieldLabel,
      currentValue,
      proposedValue,
      reason,
      evidence,
      isProtectedField: isProtected,
      requiresApproval: isProtected, // Protected fields MUST require individual manual approval
      status: 'proposed', // NEVER marked as applied upon creation
      proposedAt: new Date().toISOString(),
      rollbackAvailable: true,
      previousValueSnapshot: currentValue,
    };

    return NextResponse.json({
      success: true,
      proposal,
      taskState: 'Ready',
    });
  } catch (error) {
    console.error('Failed to prepare repair:', error);
    return NextResponse.json({ error: 'Failed to prepare repair proposal' }, { status: 500 });
  }
}
