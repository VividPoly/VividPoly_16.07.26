import { NextResponse } from 'next/server';
import { isGmailConfigured } from '@/lib/gmail-config';
import { sendContactEmailViaGmail } from '@/lib/gmail-send';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_COMPANY = 160;
const MAX_PHONE = 40;
const MAX_COUNTRY = 80;
const MAX_ENQUIRY_TYPE = 120;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 8000;

type ContactEmailBody = {
  name?: string;
  fromEmail?: string;
  subject?: string;
  message?: string;
  company?: string;
  phone?: string;
  country?: string;
  enquiryType?: string;
  website?: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  if (!isGmailConfigured()) {
    return jsonError('Email service is not configured on the server.', 503);
  }

  let body: ContactEmailBody;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const fromEmail = body.fromEmail?.trim() ?? '';
  const subject = body.subject?.trim() ?? '';
  const message = body.message?.trim() ?? '';
  const name = body.name?.trim() ?? '';
  const company = body.company?.trim() ?? '';
  const phone = body.phone?.trim() ?? '';
  const country = body.country?.trim() ?? '';
  const enquiryType = body.enquiryType?.trim() ?? '';

  if (!fromEmail || !EMAIL_RE.test(fromEmail)) {
    return jsonError('Enter a valid email address.', 400);
  }

  if (!message) {
    return jsonError('Add a short message before sending.', 400);
  }

  if (
    name.length > MAX_NAME
    || company.length > MAX_COMPANY
    || phone.length > MAX_PHONE
    || country.length > MAX_COUNTRY
    || enquiryType.length > MAX_ENQUIRY_TYPE
    || subject.length > MAX_SUBJECT
    || message.length > MAX_MESSAGE
  ) {
    return jsonError('Message is too long.', 400);
  }

  try {
    const result = await sendContactEmailViaGmail({
      name,
      company,
      phone,
      country,
      enquiryType,
      fromEmail,
      subject: subject || (enquiryType ? `Website enquiry: ${enquiryType}` : 'Website enquiry from vividpoly.com'),
      message,
    });

    return NextResponse.json({ ok: true, to: result.to });
  } catch (error) {
    console.error('[contact-email]', error);
    return jsonError('We could not send your message. Please try again or call us directly.', 500);
  }
}
