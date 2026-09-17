import { NextResponse } from 'next/server';
import { getAIStatus, getGeminiClient, recordUsage, recordError, getConfiguredModel } from '@/lib/gemini';

export async function GET() {
  const status = getAIStatus();
  return NextResponse.json(status);
}

export async function POST() {
  const startTime = Date.now();
  const status = getAIStatus();
  const ai = getGeminiClient();
  const model = getConfiguredModel();

  if (!ai) {
    return NextResponse.json(
      {
        success: false,
        latencyMs: Date.now() - startTime,
        status,
        message:
          'AI is not currently connected. To connect, attach a Google Cloud Service Account with "roles/aiplatform.user" (Vertex AI) on Cloud Run, or provide GEMINI_API_KEY in the application settings.',
      },
      { status: 400 }
    );
  }

  try {
    const prompt = 'Health check ping for Arthur’s AI Workforce backend. Reply with: {"status": "ok", "service": "Vertex AI / Gemini", "role": "Google Business Profile AI Brain"}';
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const latencyMs = Date.now() - startTime;
    recordUsage(45); // small token estimate for ping

    let parsedResult = null;
    try {
      parsedResult = JSON.parse(response.text || '{}');
    } catch {
      parsedResult = { raw: response.text };
    }

    return NextResponse.json({
      success: true,
      latencyMs,
      status: getAIStatus(),
      result: parsedResult,
      message: `Successfully reached ${status.provider} (${model}) in ${latencyMs}ms.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    recordError(errorMsg);
    return NextResponse.json(
      {
        success: false,
        latencyMs: Date.now() - startTime,
        status: getAIStatus(),
        error: errorMsg,
        message: `Failed to communicate with ${status.provider}. Check that Vertex AI API is enabled or credentials have permission.`,
      },
      { status: 500 }
    );
  }
}
