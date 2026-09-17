import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhookEvent } from '@/lib/billing';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    const result = await handleStripeWebhookEvent(rawBody, signature);

    if (!result.received) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 });
  }
}
