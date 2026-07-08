import { google } from 'googleapis';
import { getGmailConfig } from '@/lib/gmail-config';

export type ContactEmailPayload = {
  name?: string;
  fromEmail: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  country?: string;
  enquiryType?: string;
};

function encodeMimeMessage(lines: string[]) {
  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function buildPlainTextBody(payload: ContactEmailPayload) {
  const detailLines = [
    payload.name?.trim() ? `Name: ${payload.name.trim()}` : '',
    payload.company?.trim() ? `Company: ${payload.company.trim()}` : '',
    `Email: ${payload.fromEmail.trim()}`,
    payload.phone?.trim() ? `Phone / WhatsApp: ${payload.phone.trim()}` : '',
    payload.country?.trim() ? `Country: ${payload.country.trim()}` : '',
    payload.enquiryType?.trim() ? `Enquiry type: ${payload.enquiryType.trim()}` : '',
  ].filter(Boolean);

  const lines = [
    ...detailLines,
    '',
    payload.message.trim(),
    '',
    '—',
    'Sent via vividpoly.com contact enquiry form',
  ];

  return lines.join('\n');
}

export async function sendContactEmailViaGmail(payload: ContactEmailPayload) {
  const config = getGmailConfig();
  if (!config) {
    throw new Error('GMAIL_NOT_CONFIGURED');
  }

  const oauth2 = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri,
  );

  oauth2.setCredentials({ refresh_token: config.refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2 });
  const subject = payload.subject.trim() || 'Website enquiry';
  const body = buildPlainTextBody(payload);
  const visitorName = payload.name?.trim() || payload.fromEmail.trim();

  const mime = encodeMimeMessage([
    `From: VIVIDPOLY Website <${config.senderEmail}>`,
    `To: ${config.inboxTo}`,
    `Reply-To: ${visitorName} <${payload.fromEmail.trim()}>`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    body,
  ]);

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: mime },
  });

  return { to: config.inboxTo };
}
