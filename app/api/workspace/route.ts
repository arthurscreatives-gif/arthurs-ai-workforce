import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth, switchWorkspaceForSession } from '@/lib/auth-session';
import {
  getWorkspaceById,
  saveWorkspace,
  sanitizeWorkspaceForClient,
} from '@/lib/workspace-store';

export async function GET(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    workspace: sanitizeWorkspaceForClient(auth.workspace, auth.user.role),
  });
}

// Switch active workspace or update settings/facts
export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 1. Switch workspace action
    if (body.action === 'switch' && typeof body.workspaceId === 'string') {
      const switched = switchWorkspaceForSession(auth.token, body.workspaceId);
      if (!switched) {
        return NextResponse.json(
          { error: 'Workspace not found or unauthorized.' },
          { status: 403 }
        );
      }
      const newWs = getWorkspaceById(body.workspaceId);
      return NextResponse.json({
        success: true,
        workspace: newWs ? sanitizeWorkspaceForClient(newWs, auth.user.role) : null,
      });
    }

    // 2. Update workspace facts, settings, or profile
    const ws = auth.workspace;

    if (body.approvedFacts) {
      ws.approvedFacts = {
        ...ws.approvedFacts,
        ...body.approvedFacts,
        lastConfirmedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York',
        }) + ' EDT',
      };
    }

    if (body.settings) {
      ws.settings = {
        ...ws.settings,
        ...body.settings,
      };
    }

    if (body.liveProfile) {
      ws.liveProfile = {
        ...ws.liveProfile,
        ...body.liveProfile,
      };
    }

    if (body.connectionStatus) {
      ws.connectionStatus = body.connectionStatus;
    }

    if (body.googleConnection) {
      ws.googleConnection = {
        ...ws.googleConnection,
        ...body.googleConnection,
      };
    }

    saveWorkspace(ws);

    return NextResponse.json({
      success: true,
      workspace: sanitizeWorkspaceForClient(ws, auth.user.role),
    });
  } catch (err: any) {
    console.error('Workspace update error:', err);
    return NextResponse.json({ error: 'Failed to update workspace.' }, { status: 500 });
  }
}
