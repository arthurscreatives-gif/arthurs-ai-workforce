import { NextRequest, NextResponse } from 'next/server';
import { resolveAuth, sanitizeInput } from '@/lib/auth-session';
import {
  getSupportTickets,
  createSupportTicket,
  resolveSupportTicket,
} from '@/lib/workspace-store';

export async function GET(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allTickets = getSupportTickets();

  // If customer, only show their own tickets
  if (auth.user.role !== 'owner') {
    const customerTickets = allTickets.filter((t) => t.workspaceId === auth.workspace.id);
    return NextResponse.json({ tickets: customerTickets });
  }

  // Owner sees all tickets
  return NextResponse.json({ tickets: allTickets });
}

export async function POST(req: NextRequest) {
  const auth = resolveAuth(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Resolution by owner
    if (body.action === 'resolve' && body.ticketId) {
      if (auth.user.role !== 'owner') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const success = resolveSupportTicket(body.ticketId, body.adminNotes);
      return NextResponse.json({ success });
    }

    // New ticket creation
    const subject = sanitizeInput(body.subject);
    const message = sanitizeInput(body.message);
    const category = body.category || 'other';
    const priority = body.priority || 'medium';

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
    }

    const newTicket = createSupportTicket({
      workspaceId: auth.workspace.id,
      userEmail: auth.user.email,
      subject,
      message,
      category,
      priority,
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch {
    return NextResponse.json({ error: 'Failed to process ticket request' }, { status: 500 });
  }
}
