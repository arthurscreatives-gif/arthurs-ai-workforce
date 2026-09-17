import { NextRequest, NextResponse } from 'next/server';

let savedClientId = '';

export async function GET(req: NextRequest) {
  const queryClientId = req.nextUrl.searchParams.get('client_id');
  const clientId = queryClientId || savedClientId || process.env.GOOGLE_CLIENT_ID || '';
  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const redirectUri = `${appUrl}/auth/callback`;

  // Required Google Business Profile API scopes
  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' ');

  const googleAuthBase = 'https://accounts.google.com/o/oauth2/v2/auth';
  const queryParams = new URLSearchParams({
    client_id: clientId || 'PENDING_SETUP',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: 'gbp_auth_' + Date.now(),
  });

  const fullAuthUrl = `${googleAuthBase}?${queryParams.toString()}`;

  return NextResponse.json({
    url: fullAuthUrl,
    configured: Boolean(clientId && clientId !== 'PENDING_SETUP'),
    clientId: clientId && clientId !== 'PENDING_SETUP' ? clientId : '',
    redirectUri,
    scopes: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    requiredApis: [
      'My Business Account Management API',
      'My Business Business Information API',
      'Google My Business API',
    ],
    note: clientId && clientId !== 'PENDING_SETUP'
      ? 'Google Client ID is configured.'
      : 'GOOGLE_CLIENT_ID is not configured yet. Paste your Client ID from Google Cloud Console into the form or use Sandbox / Verification Mode to test all workforce tools.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.clientId === 'string') {
      savedClientId = body.clientId.trim();
    }
    return NextResponse.json({ success: true, clientId: savedClientId });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}

