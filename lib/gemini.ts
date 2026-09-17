import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
let activeProviderMode: 'vertex' | 'api_key' | 'none' = 'none';
let lastSuccessfulRequestAt: string | null = null;
let lastError: string | null = null;

// Spending & Usage Tracker
interface AIUsageStats {
  date: string;
  dailyRequests: number;
  totalRequests: number;
  estimatedTokens: number;
  maxDailyRequests: number;
}

const usageStats: AIUsageStats = {
  date: new Date().toISOString().split('T')[0],
  dailyRequests: 0,
  totalRequests: 0,
  estimatedTokens: 0,
  maxDailyRequests: 50, // Configurable limit
};

// Simple in-memory response cache to avoid duplicate AI requests for identical input
const responseCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function getCachedAIResponse<T>(cacheKey: string): T | null {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return null;
  }
  return cached.data as T;
}

export function setCachedAIResponse(cacheKey: string, data: unknown): void {
  // Cap cache size
  if (responseCache.size > 100) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(cacheKey, { data, timestamp: Date.now() });
}

export function checkDailyQuota(): { allowed: boolean; remaining: number; dailyRequests: number; maxDailyRequests: number } {
  const today = new Date().toISOString().split('T')[0];
  if (usageStats.date !== today) {
    usageStats.date = today;
    usageStats.dailyRequests = 0;
  }
  const remaining = Math.max(0, usageStats.maxDailyRequests - usageStats.dailyRequests);
  return {
    allowed: usageStats.dailyRequests < usageStats.maxDailyRequests,
    remaining,
    dailyRequests: usageStats.dailyRequests,
    maxDailyRequests: usageStats.maxDailyRequests,
  };
}

export function recordUsage(estimatedTokens: number = 250): void {
  const today = new Date().toISOString().split('T')[0];
  if (usageStats.date !== today) {
    usageStats.date = today;
    usageStats.dailyRequests = 0;
  }
  usageStats.dailyRequests += 1;
  usageStats.totalRequests += 1;
  usageStats.estimatedTokens += estimatedTokens;
  lastSuccessfulRequestAt = new Date().toISOString();
  lastError = null;
}

export function recordError(errorMsg: string): void {
  lastError = errorMsg;
}

export function getGeminiClient(): GoogleGenAI | null {
  const useVertex =
    process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true' ||
    Boolean(process.env.VERTEX_PROJECT_ID) ||
    Boolean(process.env.GOOGLE_CLOUD_PROJECT && !process.env.GEMINI_API_KEY);

  const apiKey = process.env.GEMINI_API_KEY;
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID || '';
  const location = process.env.VERTEX_LOCATION || 'us-central1';

  // 1. Try Vertex AI if explicitly configured or on Cloud Run without an API key
  if (useVertex && project) {
    if (!geminiClient || activeProviderMode !== 'vertex') {
      try {
        geminiClient = new GoogleGenAI({
          vertexai: true,
          project,
          location,
          httpOptions: {
            headers: {
              'User-Agent': 'arthurs-ai-workforce-vertex',
            },
          },
        });
        activeProviderMode = 'vertex';
      } catch (err) {
        console.error('Failed to initialize Vertex AI client:', err);
      }
    }
    if (geminiClient && activeProviderMode === 'vertex') return geminiClient;
  }

  // 2. Fall back to Gemini API key if present
  if (apiKey) {
    if (!geminiClient || activeProviderMode !== 'api_key') {
      try {
        geminiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'arthurs-ai-workforce-gemini',
            },
          },
        });
        activeProviderMode = 'api_key';
      } catch (err) {
        console.error('Failed to initialize Gemini API key client:', err);
      }
    }
    if (geminiClient && activeProviderMode === 'api_key') return geminiClient;
  }

  // 3. If running on Cloud Run with an attached service account, attempt Vertex AI with default environment
  if (process.env.K_SERVICE || process.env.GOOGLE_CLOUD_PROJECT) {
    try {
      const defaultProject = process.env.GOOGLE_CLOUD_PROJECT || 'arthurs-creatives-cloud';
      geminiClient = new GoogleGenAI({
        vertexai: true,
        project: defaultProject,
        location,
      });
      activeProviderMode = 'vertex';
      return geminiClient;
    } catch {
      // Graceful fallback
    }
  }

  return null;
}

export function getConfiguredModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

export function getConfiguredLocation(): string {
  return process.env.VERTEX_LOCATION || 'us-central1';
}

export function getAIStatus(): {
  provider: string;
  model: string;
  location: string;
  authMethod: string;
  isConfigured: boolean;
  dailyRequests: number;
  maxDailyRequests: number;
  totalRequests: number;
  estimatedTokens: number;
  lastSuccessfulRequestAt: string | null;
  lastError: string | null;
  activeMode: 'vertex' | 'api_key' | 'none';
  setupInstructions: string;
} {
  const apiKey = process.env.GEMINI_API_KEY;
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.VERTEX_PROJECT_ID;
  const useVertex = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true' || (project && !apiKey);
  const location = getConfiguredLocation();
  const model = getConfiguredModel();

  const isConfigured = Boolean(apiKey || (useVertex && project) || process.env.K_SERVICE);

  let provider = 'Google Cloud Vertex AI';
  let authMethod = 'Google Cloud Service Account (ADC)';
  let activeMode: 'vertex' | 'api_key' | 'none' = 'vertex';
  let setupInstructions =
    'Vertex AI is ready. When deployed to Cloud Run, it uses the container service account with roles/aiplatform.user.';

  if (apiKey && !useVertex) {
    provider = 'Google Gemini Developer API';
    authMethod = 'Server API Key';
    activeMode = 'api_key';
    setupInstructions = 'Connected via server-side Gemini API key.';
  } else if (!isConfigured) {
    activeMode = 'none';
    authMethod = 'Pending Setup';
    setupInstructions =
      'To use Vertex AI on Google Cloud: Ensure your Cloud Run service account has the "Vertex AI User" (roles/aiplatform.user) role and set GOOGLE_CLOUD_PROJECT. Alternatively, set GEMINI_API_KEY in the Secrets settings.';
  }

  return {
    provider,
    model,
    location,
    authMethod,
    isConfigured,
    dailyRequests: usageStats.dailyRequests,
    maxDailyRequests: usageStats.maxDailyRequests,
    totalRequests: usageStats.totalRequests,
    estimatedTokens: usageStats.estimatedTokens,
    lastSuccessfulRequestAt,
    lastError,
    activeMode,
    setupInstructions,
  };
}

