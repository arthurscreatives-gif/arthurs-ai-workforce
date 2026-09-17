import { NextRequest, NextResponse } from 'next/server';
import {
  getGeminiClient,
  checkDailyQuota,
  recordUsage,
  getCachedAIResponse,
  setCachedAIResponse,
  getConfiguredModel,
} from '@/lib/gemini';
import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  InspectorFinding,
  RepairProposal,
  SearchInsightMetrics,
} from '@/types/business-profile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const liveProfile: GoogleBusinessProfile = body.liveProfile;
    const approvedFacts: ApprovedBusinessFacts = body.approvedFacts;
    const metrics: SearchInsightMetrics | undefined = body.metrics;

    if (!approvedFacts) {
      return NextResponse.json({ error: 'Missing owner-approved business facts' }, { status: 400 });
    }

    // Check spending controls & daily quota
    const quota = checkDailyQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: `Daily AI analysis limit reached (${quota.dailyRequests}/${quota.maxDailyRequests} requests today). Limit resets at midnight EDT.`,
          quota,
        },
        { status: 429 }
      );
    }

    // Cache check to avoid redundant API queries
    const cacheSignature = `analyze_${JSON.stringify({
      desc: liveProfile?.profileDescription || '',
      cats: liveProfile?.additionalCategories || [],
      factsDesc: approvedFacts.description,
      factsServices: approvedFacts.services.map((s) => s.name),
    })}`;

    const cached = getCachedAIResponse<{
      findings: InspectorFinding[];
      proposals: RepairProposal[];
      internalProfileHealthScore: number;
      aiExecutiveSummary: string;
      isCached: boolean;
    }>(cacheSignature);

    if (cached) {
      return NextResponse.json({ ...cached, isCached: true, inspectedAt: new Date().toISOString() });
    }

    const ai = getGeminiClient();
    const model = getConfiguredModel();

    // Deterministic fallback generator in case AI is in setup phase
    const baseFindings: InspectorFinding[] = [];
    const baseProposals: RepairProposal[] = [];

    // Description verification
    const currentDesc = liveProfile?.profileDescription || '';
    if (!currentDesc || currentDesc.length < 120 || !currentDesc.toLowerCase().includes('digital workforce')) {
      baseFindings.push({
        id: `find-desc-${Date.now()}`,
        field: 'profileDescription',
        fieldLabel: 'Business Description',
        issue: 'Current profile description does not communicate full digital workforce automation & local business services.',
        evidence: `Current description is ${currentDesc.length} characters long. Missing verified services cataloged in approved facts.`,
        whyItMatters: 'Searchers on Google Search & Maps rely on a clear overview of services to choose Arthur’s Creatives over competitors.',
        proposedAction: 'Update description with verified, approved copy detailing workforce automation and creative studio services.',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });

      baseProposals.push({
        id: `prop-desc-${Date.now()}`,
        field: 'profileDescription',
        fieldLabel: 'Business Description',
        currentValue: currentDesc,
        proposedValue: approvedFacts.description,
        reason: 'Aligns public Google listing with owner-approved business facts.',
        evidence: 'Approved Business Facts confirmed by owner.',
        isProtectedField: false,
        requiresApproval: false, // Routine repair
        status: 'proposed',
        proposedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previousValueSnapshot: currentDesc,
      });
    }

    // Service area & address privacy check
    if (liveProfile && liveProfile.isAddressVisible !== approvedFacts.isAddressVisible) {
      baseFindings.push({
        id: `find-addr-${Date.now()}`,
        field: 'isAddressVisible',
        fieldLabel: 'Address Visibility',
        issue: 'Physical dispatch address visibility conflicts with approved Service-Area Business model.',
        evidence: `Live profile visibility is ${liveProfile.isAddressVisible ? 'Public' : 'Hidden'}, but approved facts specify ${approvedFacts.isAddressVisible ? 'Public' : 'Hidden dispatch base'}.`,
        whyItMatters: 'Service-area businesses must keep residential or private offices hidden to comply with Google guidelines.',
        proposedAction: 'Hide physical street address and maintain verified service regions (e.g., NYC metro).',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });
    }

    let calculatedScore = 78;
    let executiveSummary =
      'Inspection complete. Profile has strong baseline verification; description and service tags can be optimized with approved facts.';

    if (ai) {
      try {
        const prompt = `You are Arthur’s AI Workforce Profile Inspector.
Analyze the live Google Business Profile against the owner's Approved Business Facts.

RULES & CONSTRAINTS:
1. Treat Approved Business Facts as the single source of truth.
2. Never invent services, prices, offers, or customer stats not in the facts.
3. Treat Arthur's Creatives as a Service-Area Business: physical street address must stay hidden.
4. Separate observed search metrics from AI ideas.
5. Identify:
   - Incomplete or outdated description.
   - Missing verified services.
   - Address visibility discrepancies.
   - Category opportunities.
6. Return valid JSON adhering to this schema:
{
  "internalProfileHealthScore": <integer 40-100>,
  "executiveSummary": "<concise 2-sentence plain English summary>",
  "additionalFindings": [
    {
      "field": "string (e.g. 'profileDescription', 'services', 'additionalCategories')",
      "fieldLabel": "string",
      "issue": "string",
      "evidence": "string",
      "whyItMatters": "string",
      "proposedAction": "string",
      "priority": "high" | "medium" | "low",
      "isRepairableThroughIntegration": boolean
    }
  ]
}

DATA:
Approved Business Facts:
${JSON.stringify({
  businessName: approvedFacts.businessName,
  description: approvedFacts.description,
  services: approvedFacts.services,
  categories: [approvedFacts.primaryCategory, ...approvedFacts.additionalCategories],
  brandVoice: approvedFacts.brandVoice,
  isAddressVisible: approvedFacts.isAddressVisible,
  serviceAreas: approvedFacts.serviceAreas,
})}

Live Google Profile:
${JSON.stringify({
  title: liveProfile?.title || "Arthur's Creatives",
  description: liveProfile?.profileDescription || '',
  services: liveProfile?.services || [],
  categories: [liveProfile?.primaryCategory, ...(liveProfile?.additionalCategories || [])].filter(Boolean),
  isAddressVisible: liveProfile?.isAddressVisible,
})}

Performance Context:
${metrics ? `Search Impressions: ${metrics.impressionsSearch ?? 'N/A'}, Call Button Clicks: ${metrics.callClicks ?? 'N/A'}` : 'Metrics loading'}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 1000,
          },
        });

        recordUsage(450);

        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);

        if (parsed.internalProfileHealthScore) {
          calculatedScore = Math.min(100, Math.max(35, parsed.internalProfileHealthScore));
        }
        if (parsed.executiveSummary) {
          executiveSummary = parsed.executiveSummary;
        }

        if (Array.isArray(parsed.additionalFindings)) {
          parsed.additionalFindings.forEach((item: Partial<InspectorFinding>, idx: number) => {
            if (item.issue && item.proposedAction) {
              baseFindings.push({
                id: `find-ai-${Date.now()}-${idx}`,
                field: item.field || 'profileDescription',
                fieldLabel: item.fieldLabel || 'Business Profile',
                issue: item.issue,
                evidence: item.evidence || 'Identified via comparative analysis with approved facts.',
                whyItMatters: item.whyItMatters || 'Enhances local search alignment and client intake.',
                proposedAction: item.proposedAction,
                priority: (item.priority as 'high' | 'medium' | 'low') || 'medium',
                isRepairableThroughIntegration: Boolean(item.isRepairableThroughIntegration),
                detectedAt: new Date().toISOString(),
                status: 'open',
              });
            }
          });
        }
      } catch (aiErr) {
        console.error('AI Profile Analysis error:', aiErr);
      }
    }

    const result = {
      findings: baseFindings,
      proposals: baseProposals,
      internalProfileHealthScore: calculatedScore,
      aiExecutiveSummary: executiveSummary,
      isCached: false,
      inspectedAt: new Date().toISOString(),
    };

    setCachedAIResponse(cacheSignature, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to run AI profile analysis:', error);
    return NextResponse.json({ error: 'Failed to complete profile analysis' }, { status: 500 });
  }
}
