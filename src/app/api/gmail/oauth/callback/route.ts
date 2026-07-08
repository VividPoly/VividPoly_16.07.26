import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getGoogleOAuthConfig } from '@/lib/gmail-config';

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

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new NextResponse(`OAuth error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('Missing authorization code.', { status: 400 });
  }

  const config = getGoogleOAuthConfig();
  if (!config) {
    return new NextResponse('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.', {
      status: 503,
    });
  }

  const oauth2 = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );

  const { tokens } = await oauth2.getToken(code);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Gmail OAuth setup</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    code, pre { background: #f4f4f5; border-radius: 6px; }
    pre { padding: 1rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
    h1 { font-size: 1.25rem; }
  </style>
</head>
<body>
  <h1>Gmail OAuth setup complete</h1>
  <p>Copy the refresh token into <code>.env.local</code> (local) and your Vercel project env (production):</p>
  <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token ?? '(no refresh token returned — revoke app access in Google Account and run setup again with prompt=consent)'}</pre>
  <p>Also set:</p>
  <pre>GMAIL_SENDER_EMAIL=info@vividpoly.com
GMAIL_INBOX_TO=info@vividpoly.com</pre>
  <p>Restart the dev server after saving env vars. You can close this tab.</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
