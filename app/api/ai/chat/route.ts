import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, checkDailyQuota, recordUsage } from '@/lib/gemini';
import { CHAT_ROLES, ChatRoleKey } from '@/types/ai-chat';

interface ChatMessageInput {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessageInput[] = body.messages || [];
    const roleKey: string = body.role || 'workforce_architect';
    const customSystemInstruction: string = body.systemInstruction || '';
    const requestedModel: string = body.model || 'gemini-3.5-flash';
    const useSearchGrounding: boolean = Boolean(body.useSearchGrounding);

    if (!messages.length) {
      return NextResponse.json({ error: 'Message history cannot be empty' }, { status: 400 });
    }

    // Determine model according to task complexity:
    // gemini-3.1-pro-preview: complex reasoning tasks
    // gemini-3.5-flash: general tasks
    // gemini-3.1-flash-lite: tasks that should happen fast
    let selectedModel = 'gemini-3.5-flash';
    if (requestedModel === 'gemini-3.1-pro-preview') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (requestedModel === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else {
      selectedModel = 'gemini-3.5-flash';
    }

    // Check daily quota
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
        { error: 'Gemini client is not configured on the server. Please check GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // Compile system instruction
    const baseInstruction =
      customSystemInstruction.trim() ||
      CHAT_ROLES[roleKey as ChatRoleKey]?.systemInstruction ||
      CHAT_ROLES.workforce_architect.systemInstruction;

    // Convert multi-turn history into format expected by SDK
    // Keep last 15 messages for context window efficiency
    const recentMessages = messages.slice(-15);
    const contents = recentMessages.map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    // Configure tools: if search grounding requested, use googleSearch
    // Note: if search grounding is requested, gemini-3.5-flash is optimized for search grounding
    const tools = useSearchGrounding ? [{ googleSearch: {} }] : undefined;

    const response = await ai.models.generateContent({
      model: useSearchGrounding && selectedModel === 'gemini-3.1-flash-lite' ? 'gemini-3.5-flash' : selectedModel,
      contents,
      config: {
        systemInstruction: baseInstruction,
        tools,
        temperature: 0.7,
      },
    });

    const text = response.text || 'No response generated.';

    // Extract grounding sources if applicable
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Array<{ title?: string; uri?: string }> = [];

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

    recordUsage(280);

    return NextResponse.json({
      text,
      modelUsed: selectedModel,
      role: roleKey,
      sources,
      searchQueries: groundingMetadata?.webSearchQueries || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in multi-turn chat route:', error);
    const message = error instanceof Error ? error.message : 'Chat generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
