import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getGoogleOAuthConfig } from '@/lib/gmail-config';

const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

function isSetupAllowed(request: Request) {
  const setupKey = process.env.GMAIL_OAUTH_SETUP_KEY?.trim();
  if (!setupKey) return process.env.NODE_ENV !== 'production';

  const url = new URL(request.url);
  return url.searchParams.get('key') === setupKey;
}

export async function GET(request: Request) {
  if (!isSetupAllowed(request)) {
    return NextResponse.json({ error: 'OAuth setup is disabled.' }, { status: 403 });
  }

  const config = getGoogleOAuthConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.' },
      { status: 503 },
    );
  }

  const oauth2 = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );

  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [GMAIL_SEND_SCOPE],
  });

  return NextResponse.redirect(url);
}
