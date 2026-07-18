import { NextResponse } from 'next/server';
import { isGmailConfigured } from '@/lib/gmail-config';
import { sendContactEmailViaGmail } from '@/lib/gmail-send';
import { createOdooLead, isOdooConfigured, type OdooDetail } from '@/lib/odoo';

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

  const resolvedSubject =
    subject || (enquiryType ? `Website enquiry: ${enquiryType}` : 'Website enquiry from vividpoly.com');

  // If nothing is configured we can't do anything useful. Kept as 503 so the
  // existing frontend (which treats 503 as "accepted") is unaffected.
  if (!isOdooConfigured() && !isGmailConfigured()) {
    return jsonError('Lead service is not configured on the server.', 503);
  }

  let delivered = false;

  // 1) Odoo CRM lead — the primary destination. Best-effort: a failure here is
  //    logged but does not block, as long as the email still gets through.
  if (isOdooConfigured()) {
    const details: OdooDetail[] = [{ label: 'Enquiry type', value: enquiryType }];
    try {
      const leadId = await createOdooLead({
        name: enquiryType
          ? `Website enquiry: ${enquiryType}${name ? ` — ${name}` : ''}`
          : resolvedSubject,
        contactName: name,
        emailFrom: fromEmail,
        phone,
        company,
        country,
        message,
        details,
      });
      console.info('[contact-email] Odoo lead created', leadId);
      delivered = true;
    } catch (error) {
      console.error('[contact-email] Odoo lead failed', error);
    }
  }

  // 2) Email notification — unchanged behaviour, still sent when configured.
  if (isGmailConfigured()) {
    try {
      await sendContactEmailViaGmail({
        name,
        company,
        phone,
        country,
        enquiryType,
        fromEmail,
        subject: resolvedSubject,
        message,
      });
      delivered = true;
    } catch (error) {
      console.error('[contact-email] email failed', error);
    }
  }

  if (!delivered) {
    return jsonError(
      'We could not submit your enquiry. Please try again or contact us directly.',
      502,
    );
  }

  return NextResponse.json({ ok: true });
}
