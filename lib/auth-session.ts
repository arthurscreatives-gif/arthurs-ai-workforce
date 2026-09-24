import { NextRequest } from 'next/server';
import { User, Workspace } from '@/types/workspace';
import { getUserById, getWorkspaceById, getUserByEmail } from './workspace-store';

export interface SessionData {
  userId: string;
  workspaceId: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory active session store
const sessions = new Map<string, SessionData>();

// In-memory rate limiting sliding window
interface RateLimitEntry {
  timestamps: number[];
}
const rateLimits = new Map<string, RateLimitEntry>();

export function createSession(userId: string, workspaceId: string): string {
  const token = `sess_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  sessions.set(token, {
    userId,
    workspaceId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days
  });
  return token;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function switchWorkspaceForSession(token: string, newWorkspaceId: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  const ws = getWorkspaceById(newWorkspaceId);
  if (!ws) return false;

  // Authorization check: User must own the workspace or be platform owner
  const user = getUserById(session.userId);
  if (!user) return false;

  if (user.role !== 'owner' && ws.userId !== user.id) {
    return false;
  }

  session.workspaceId = newWorkspaceId;
  return true;
}

export function getSessionData(token: string): { user: User; workspace: Workspace } | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  const user = getUserById(session.userId);
  const workspace = getWorkspaceById(session.workspaceId);

  if (!user || !workspace) {
    return null;
  }

  // Ensure customer cannot access another user's workspace
  if (user.role !== 'owner' && workspace.userId !== user.id) {
    return null;
  }

  return { user, workspace };
}

export function resolveAuth(req: Request | NextRequest): {
  user: User;
  workspace: Workspace;
  token: string;
} | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check x-session-token header
  if (!token) {
    token = req.headers.get('x-session-token');
  }

  // 3. Check Cookie
  if (!token && 'cookies' in req) {
    const cookieToken = (req as NextRequest).cookies.get('arthur_session')?.value;
    if (cookieToken) token = cookieToken;
  } else if (!token) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/arthur_session=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    return null;
  }

  const data = getSessionData(token);
  if (!data) {
    return null;
  }

  return { ...data, token };
}

// -------------------------------------------------------------
// RATE LIMITING (Sliding window)
// -------------------------------------------------------------
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = rateLimits.get(key) || { timestamps: [] };

  // Discard older timestamps outside the window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  entry.timestamps.push(now);
  rateLimits.set(key, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetSeconds: windowSeconds,
  };
}

// -------------------------------------------------------------
// UNTRUSTED INPUT SANITIZATION
// -------------------------------------------------------------
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Strip XML/HTML tags
    .trim();
}

// -------------------------------------------------------------
// SECRETS REDACTION FROM LOGS & STRINGS
// -------------------------------------------------------------
export function redactSecretsFromText(text: string): string {
  if (!text) return '';
  return text
    .replace(/(sk_[a-zA-Z0-9_-]{20,})/g, '[REDACTED_STRIPE_KEY]')
    .replace(/(whsec_[a-zA-Z0-9_-]{20,})/g, '[REDACTED_WEBHOOK_SECRET]')
    .replace(/(ya29\.[a-zA-Z0-9_-]{20,})/g, '[REDACTED_GOOGLE_TOKEN]')
    .replace(/("client_secret":\s*")[^"]+(")/g, '$1[REDACTED]$2')
    .replace(/("password":\s*")[^"]+(")/g, '$1[REDACTED]$2');
}
