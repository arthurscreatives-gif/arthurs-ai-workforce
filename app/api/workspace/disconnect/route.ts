import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { saveWorkspace, sanitizeWorkspaceForClient } from '@/lib/workspace-store';

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ws = auth.workspace;

  // In compliance with Google API User Data Policy:
  // Purge any cached tokens and mark status disconnected
  ws.connectionStatus = 'not_connected';
  ws.googleConnection = {
    status: 'disconnected',
    projectModel: ws.googleConnection.projectModel,
    authorizedEmail: undefined,
    googleAccountId: undefined,
    locationId: undefined,
    scopeGranted: [],
    customClientId: undefined,
    connectedAt: undefined,
    readOnlyReason: 'Google account disconnected by user. Profile credentials purged.',
  };

  // Immediate halt of automated background writes
  ws.settings.isAutomationPaused = true;

  ws.logs.unshift({
    id: `act-disc-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
    action: 'Google Account Disconnected',
    details: 'User initiated account disconnection. Google tokens purged in compliance with Google API Data Policy.',
    authorization: 'owner_revocation',
    result: 'success',
  });

  saveWorkspace(ws);

  return NextResponse.json({
    success: true,
    message: 'Google account disconnected and tokens purged successfully.',
    workspace: sanitizeWorkspaceForClient(ws, auth.user.role),
  });
}
