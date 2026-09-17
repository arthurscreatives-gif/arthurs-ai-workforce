import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { ApprovedBusinessFacts, GoogleBusinessProfile, InspectorFinding, RepairProposal } from '@/types/business-profile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const liveProfile: GoogleBusinessProfile = body.liveProfile;
    const approvedFacts: ApprovedBusinessFacts = body.approvedFacts;

    if (!liveProfile || !approvedFacts) {
      return NextResponse.json({ error: 'Missing liveProfile or approvedFacts' }, { status: 400 });
    }

    const ai = getGeminiClient();

    // Default programmatic findings generator in case Gemini is not available or for verification
    const programmaticFindings: InspectorFinding[] = [];
    const programmaticProposals: RepairProposal[] = [];

    // 1. Description check
    const currentDesc = liveProfile.profileDescription || '';
    const targetDesc = approvedFacts.description;
    if (!currentDesc || currentDesc.length < 100 || !currentDesc.toLowerCase().includes('workforce') || !currentDesc.toLowerCase().includes('brand')) {
      programmaticFindings.push({
        id: `find-${Date.now()}-1`,
        field: 'profileDescription',
        fieldLabel: 'Business Description',
        issue: 'Current profile description is truncated and omits key workforce automation and brand consulting services.',
        evidence: `Current description is only ${currentDesc.length} characters long. Fails to detail the automated workforce and local optimization capabilities verified in approved facts.`,
        whyItMatters: 'A comprehensive, clear description informs prospective local searchers of all core capabilities and supports relevant discovery across Google Search.',
        proposedAction: 'Update the profile description with verified text from the approved business facts source.',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });

      programmaticProposals.push({
        id: `rep-${Date.now()}-1`,
        field: 'profileDescription',
        fieldLabel: 'Business Description',
        currentValue: currentDesc,
        proposedValue: targetDesc,
        reason: 'Aligns live listing with owner-approved business facts, communicating full digital workforce and local consulting capabilities.',
        evidence: 'Directly sourced from confirmed Approved Business Facts.',
        isProtectedField: false,
        requiresApproval: false,
        status: 'proposed',
        proposedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previousValueSnapshot: currentDesc,
      });
    }

    // 2. Services check
    const liveServiceNames = (liveProfile.services || []).map((s) => s.name.toLowerCase());
    const missingServices = approvedFacts.services.filter(
      (s) => !liveServiceNames.some((l) => l.includes(s.name.toLowerCase().slice(0, 15)))
    );

    if (missingServices.length > 0) {
      programmaticFindings.push({
        id: `find-${Date.now()}-2`,
        field: 'services',
        fieldLabel: 'Service Menu Catalog',
        issue: `Missing ${missingServices.length} verified service items from Google profile service menu.`,
        evidence: `Approved facts list ${approvedFacts.services.length} services, but the live profile only contains ${liveProfile.services?.length || 0}. Missing: ${missingServices.map((m) => m.name).join(', ')}.`,
        whyItMatters: 'Google Maps displays service chips on mobile. Missing services reduce click-through rate for searchers looking for specific offerings like workforce automation.',
        proposedAction: 'Publish missing services with approved descriptions and pricing parameters to the Google Business Profile catalog.',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });

      programmaticProposals.push({
        id: `rep-${Date.now()}-2`,
        field: 'services',
        fieldLabel: 'Service Menu Catalog',
        currentValue: `${liveProfile.services?.length || 0} services cataloged`,
        proposedValue: `Add ${missingServices.length} missing services: ${missingServices.map((s) => s.name).join('; ')}`,
        reason: 'Syncs complete service catalog so high-intent searchers identify matching services on Maps and Search.',
        evidence: 'Matches Approved Business Facts services repository.',
        isProtectedField: false,
        requiresApproval: false,
        status: 'proposed',
        proposedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previousValueSnapshot: `${liveProfile.services?.length || 0} services cataloged`,
      });
    }

    // 3. Operating Hours check
    let hoursDiscrepancy = false;
    let hoursEvidence = '';
    for (const [day, approvedDay] of Object.entries(approvedFacts.regularHours)) {
      const liveDay = liveProfile.regularHours?.[day];
      if (!liveDay) continue;
      if (liveDay.isClosed !== approvedDay.isClosed || liveDay.open !== approvedDay.open || liveDay.close !== approvedDay.close) {
        hoursDiscrepancy = true;
        hoursEvidence += `${day}: live shows ${liveDay.isClosed ? 'Closed' : `${liveDay.open}-${liveDay.close}`}, approved is ${approvedDay.isClosed ? 'Closed' : `${approvedDay.open}-${approvedDay.close}`}. `;
      }
    }

    if (hoursDiscrepancy) {
      programmaticFindings.push({
        id: `find-${Date.now()}-3`,
        field: 'regularHours',
        fieldLabel: 'Operating Hours',
        issue: 'Discrepancy between live Google hours and verified owner operating schedule.',
        evidence: hoursEvidence,
        whyItMatters: 'Inaccurate hours cause clients to assume the business is closed, leading to lost phone inquiries on weekend mornings.',
        proposedAction: 'Synchronize weekly hours on Google Business Profile with approved owner schedule.',
        priority: 'medium',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });

      programmaticProposals.push({
        id: `rep-${Date.now()}-3`,
        field: 'regularHours',
        fieldLabel: 'Operating Hours Schedule',
        currentValue: 'Discrepancies in weekly hours (Saturday/Friday)',
        proposedValue: 'Synchronize all 7 days with approved operating schedule',
        reason: 'Prevents customer confusion and ensures phone availability indicators reflect real operations.',
        evidence: 'Approved Business Facts regular hours table.',
        isProtectedField: true, // Operating hours is a protected field!
        requiresApproval: true,
        status: 'proposed',
        proposedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previousValueSnapshot: 'Previous weekly schedule',
      });
    }

    // 4. Additional Categories check
    const liveCats = liveProfile.additionalCategories || [];
    const missingCats = approvedFacts.additionalCategories.filter((c) => !liveCats.includes(c));
    if (missingCats.length > 0) {
      programmaticFindings.push({
        id: `find-${Date.now()}-4`,
        field: 'additionalCategories',
        fieldLabel: 'Secondary Categories',
        issue: `Missing ${missingCats.length} secondary business categories.`,
        evidence: `Live profile has: [${liveCats.join(', ')}]. Missing approved categories: [${missingCats.join(', ')}].`,
        whyItMatters: 'Secondary categories qualify the listing for broader relevant category searches in Google Maps local pack.',
        proposedAction: 'Add missing approved categories to the listing.',
        priority: 'medium',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });

      programmaticProposals.push({
        id: `rep-${Date.now()}-4`,
        field: 'additionalCategories',
        fieldLabel: 'Secondary Categories',
        currentValue: liveCats.join(', ') || 'None',
        proposedValue: [...liveCats, ...missingCats].join(', '),
        reason: 'Expands category eligibility across consulting and marketing search terms.',
        evidence: 'Approved Business Facts categories.',
        isProtectedField: true, // Categories is a protected field!
        requiresApproval: true,
        status: 'proposed',
        proposedAt: new Date().toISOString(),
        rollbackAvailable: true,
        previousValueSnapshot: liveCats.join(', '),
      });
    }

    // 5. Address visibility check (Crucial for Arthur's Creatives service area business)
    if (liveProfile.isAddressVisible !== approvedFacts.isAddressVisible) {
      programmaticFindings.push({
        id: `find-${Date.now()}-5`,
        field: 'isAddressVisible',
        fieldLabel: 'Address Visibility',
        issue: 'Address visibility setting conflicts with approved service-area business model.',
        evidence: `Live profile visibility is ${liveProfile.isAddressVisible ? 'Public Street Address' : 'Hidden Service Area'}, but approved facts specify ${approvedFacts.isAddressVisible ? 'Public' : 'Hidden dispatch base'}.`,
        whyItMatters: 'Service-area businesses without customer walk-ins must keep their residential or private dispatch address hidden to comply with Google guidelines and protect privacy.',
        proposedAction: 'Set address visibility to hidden and configure service areas accurately.',
        priority: 'high',
        isRepairableThroughIntegration: true,
        detectedAt: new Date().toISOString(),
        status: 'open',
      });
    }

    // Calculate Internal Profile Health Score
    // (Note: Strictly labeled as "Internal Profile Health Score", NOT a Google score or ranking prediction)
    let score = 100;
    if (programmaticFindings.some((f) => f.field === 'profileDescription')) score -= 12;
    if (programmaticFindings.some((f) => f.field === 'services')) score -= 10;
    if (programmaticFindings.some((f) => f.field === 'regularHours')) score -= 6;
    if (programmaticFindings.some((f) => f.field === 'additionalCategories')) score -= 5;
    if (programmaticFindings.some((f) => f.field === 'isAddressVisible')) score -= 15;
    const internalProfileHealthScore = Math.max(score, 30);

    // If Gemini is available, we can also query it for deep qualitative insights
    if (ai) {
      try {
        const prompt = `You are Arthur's AI Workforce Profile Inspector. Analyze this Google Business Profile against the owner's Approved Business Facts.
Identify:
1. Missing or incomplete descriptions.
2. Inconsistencies with approved facts.
3. Opportunities to describe services more clearly without hype or keyword stuffing.

Never invent facts. Strictly preserve hidden address rules for service-area businesses.
Return a brief JSON object with an executiveSummary string.

Approved Facts:
${JSON.stringify({
  businessName: approvedFacts.businessName,
  description: approvedFacts.description,
  services: approvedFacts.services,
  categories: [approvedFacts.primaryCategory, ...approvedFacts.additionalCategories],
  brandVoice: approvedFacts.brandVoice,
})}

Live Google Profile:
${JSON.stringify({
  title: liveProfile.title,
  description: liveProfile.profileDescription,
  services: liveProfile.services,
  categories: [liveProfile.primaryCategory, ...(liveProfile.additionalCategories || [])],
})}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const textOutput = response.text || '';
        return NextResponse.json({
          findings: programmaticFindings,
          proposals: programmaticProposals,
          internalProfileHealthScore,
          aiExecutiveSummary: textOutput.slice(0, 500) || 'Inspection successfully analyzed live profile against approved business facts.',
          inspectedAt: new Date().toISOString(),
        });
      } catch (aiErr) {
        console.error('Gemini call error in inspector:', aiErr);
      }
    }

    return NextResponse.json({
      findings: programmaticFindings,
      proposals: programmaticProposals,
      internalProfileHealthScore,
      aiExecutiveSummary: `Inspection complete. Found ${programmaticFindings.length} grounded improvements to align profile with approved facts.`,
      inspectedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Inspection failed:', error);
    return NextResponse.json({ error: 'Inspection failed to execute' }, { status: 500 });
  }
}
