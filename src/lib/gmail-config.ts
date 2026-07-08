export type GmailConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  senderEmail: string;
  inboxTo: string;
  redirectUri: string;
};

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getGoogleOAuthRedirectUri() {
  return (
    process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim()
    || `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3001'}/api/gmail/oauth/callback`
  );
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = getGoogleOAuthRedirectUri();

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

export function getGmailConfig(): GmailConfig | null {
  const oauth = getGoogleOAuthConfig();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  const senderEmail = process.env.GMAIL_SENDER_EMAIL?.trim();
  const inboxTo = process.env.GMAIL_INBOX_TO?.trim() || senderEmail;

  if (!oauth || !refreshToken || !senderEmail || !inboxTo) {
    return null;
  }

  return {
    ...oauth,
    refreshToken,
    senderEmail,
    inboxTo,
  };
}

export function isGmailConfigured() {
  return getGmailConfig() !== null;
}
