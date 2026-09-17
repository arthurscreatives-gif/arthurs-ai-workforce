import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import {
  getAllWorkspaces,
  getWorkspaceById,
  saveWorkspace,
  recordAdminAction,
  getAdminActionLogs,
  sanitizeWorkspaceForClient,
} from '@/lib/workspace-store';

export async function GET(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth || auth.user.role !== 'owner') {
    return NextResponse.json(
      { error: 'Unauthorized. Arthur owner privileges required.' },
      { status: 403 }
    );
  }

  const allWorkspaces = getAllWorkspaces();
  // Sanitize all customer workspaces so no tokens or secrets are ever exposed
  const sanitized = allWorkspaces.map((ws) => sanitizeWorkspaceForClient(ws, 'owner'));

  // Calculate aggregates
  const totalWorkspaces = allWorkspaces.length;
  const activeSubscribers = allWorkspaces.filter(
    (w) => w.subscription.status === 'active' || w.subscription.status === 'trialing'
  ).length;
  const totalAiCalls = allWorkspaces.reduce(
    (acc, w) => acc + (w.entitlements.monthlyAiAnalysesUsed || 0),
    0
  );
  const totalFailedJobs = allWorkspaces.reduce(
    (acc, w) => acc + w.taskQueue.filter((t) => t.executionStatus === 'Failed').length,
    0
  );

  const logs = getAdminActionLogs();

  return NextResponse.json({
    metrics: {
      totalWorkspaces,
      activeSubscribers,
      totalAiCalls,
      totalFailedJobs,
    },
    workspaces: sanitized,
    actionLogs: logs,
  });
}

// Administrative Actions: Suspend workspace, pause automation, or force re-audit
export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth || auth.user.role !== 'owner') {
    return NextResponse.json(
      { error: 'Unauthorized. Arthur owner privileges required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { action, targetWorkspaceId, reason } = body;

    const targetWs = getWorkspaceById(targetWorkspaceId);
    if (!targetWs) {
      return NextResponse.json({ error: 'Target workspace not found' }, { status: 404 });
    }

    switch (action) {
      case 'suspend': {
        targetWs.isSuspended = true;
        targetWs.suspensionReason = reason || 'Suspended by platform administration.';
        targetWs.suspendedAt = new Date().toISOString();
        targetWs.settings.isAutomationPaused = true;
        saveWorkspace(targetWs);

        recordAdminAction({
          adminEmail: auth.user.email,
          workspaceId: targetWorkspaceId,
          action: 'suspend_workspace',
          reason: reason || 'Suspended for abusive or anomalous activity',
          details: `Workspace "${targetWs.name}" suspended. Background automation stopped.`,
        });
        break;
      }

      case 'unsuspend': {
        targetWs.isSuspended = false;
        targetWs.suspensionReason = undefined;
        targetWs.suspendedAt = undefined;
        saveWorkspace(targetWs);

        recordAdminAction({
          adminEmail: auth.user.email,
          workspaceId: targetWorkspaceId,
          action: 'unsuspend_workspace',
          reason: reason || 'Administrative review cleared',
          details: `Workspace "${targetWs.name}" unsuspended. Normal operations restored.`,
        });
        break;
      }

      case 'pause_automation': {
        targetWs.settings.isAutomationPaused = true;
        saveWorkspace(targetWs);

        recordAdminAction({
          adminEmail: auth.user.email,
          workspaceId: targetWorkspaceId,
          action: 'pause_automation',
          reason: reason || 'Safety intervention by Arthur',
          details: `Automation globally paused for "${targetWs.name}".`,
        });
        break;
      }

      case 'unpause_automation': {
        targetWs.settings.isAutomationPaused = false;
        saveWorkspace(targetWs);

        recordAdminAction({
          adminEmail: auth.user.email,
          workspaceId: targetWorkspaceId,
          action: 'unpause_automation',
          reason: reason || 'Automation resumed by Arthur',
          details: `Automation unpaused for "${targetWs.name}".`,
        });
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      workspace: sanitizeWorkspaceForClient(targetWs, 'owner'),
    });
  } catch (err) {
    console.error('Admin action error:', err);
    return NextResponse.json({ error: 'Failed to execute administrative action' }, { status: 500 });
  }
}
