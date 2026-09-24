import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, checkDailyQuota, recordUsage } from '@/lib/gemini';

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || 'latest Google Business Profile local ranking factors and optimization trends';
    const context = body.context || '';
    const businessName = body.businessName || "Arthur's Creatives";

    // Enforce quota
    const quota = checkDailyQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: `Daily AI quota reached (${quota.dailyRequests}/${quota.maxDailyRequests}). Resets at midnight.`,
          quota,
        },
        { status: 429 }
      );
    }

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json(
        { error: 'Gemini API is not configured on the server. Please check GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    const prompt = `You are the Google Search Grounding Intelligence Agent for Arthur’s AI Workforce.
Target Business: "${businessName}"
Context: ${context || 'Google Business Profile, local service automation, and customer discovery.'}

Task: Use Google Search to find current, verified, and accurate web data regarding the following topic:
"${query}"

Instructions:
1. Provide up-to-date facts, current guidelines, or live market insights.
2. Clearly distinguish verified web facts from strategic recommendations.
3. Explicitly state the relevance to Arthur’s AI Workforce automation and Google Business Profile performance.
4. Keep the tone professional, authoritative, and actionable.`;

    // Per user requirement: Use gemini-3.5-flash with googleSearch tool
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          "You are an expert Google Search Intelligence researcher for Arthur's AI Workforce. Use Google Search grounding to retrieve real-time facts and provide verified citations.",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || 'No response generated from search grounding.';

    // Extract grounding chunks and web search queries
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = [];

    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }
    }

    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];

    recordUsage(350);

    return NextResponse.json({
      text,
      sources,
      searchQueries,
      model: 'gemini-3.5-flash',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in search-grounding route:', error);
    const message = error instanceof Error ? error.message : 'Search grounding query failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
