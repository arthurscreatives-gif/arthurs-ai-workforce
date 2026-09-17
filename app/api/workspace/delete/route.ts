import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth-session';
import { deleteWorkspace, recordAdminAction } from '@/lib/workspace-store';

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user, workspace } = auth;

  // Arthur's owner workspace is protected from accidental deletion
  if (workspace.id === 'ws-arthur-creatives') {
    return NextResponse.json(
      { error: "Arthur's platform owner workspace cannot be deleted." },
      { status: 400 }
    );
  }

  // Record audit log
  recordAdminAction({
    adminEmail: user.email,
    workspaceId: workspace.id,
    action: 'purge_workspace_data',
    reason: 'Customer requested workspace and account deletion',
    details: `Workspace "${workspace.name}" and all associated audits, drafts, and facts purged permanently.`,
  });

  const deleted = deleteWorkspace(workspace.id);

  return NextResponse.json({
    success: deleted,
    message: 'Workspace and all associated records have been permanently deleted.',
  });
}
