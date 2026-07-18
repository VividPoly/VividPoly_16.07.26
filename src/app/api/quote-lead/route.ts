import { NextResponse } from 'next/server';
import {
  createOdooLead,
  updateOdooLead,
  isOdooConfigured,
  type OdooDetail,
} from '@/lib/odoo';

// Backend for the "Get a Quote" flow. The wizard captures contact details
// first, then bag specifications. We create the Odoo lead as soon as we have
// contact details (so a drop-off is never lost), and enrich the SAME lead with
// the full bag specs when the visitor submits — the client passes back the
// leadId it received so we update instead of creating a duplicate.

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type QuoteLeadBody = {
  name?: string;
  company?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  product?: string;
  message?: string;
  /** Labelled bag-spec rows from the review screen (already human-readable). */
  specs?: { label?: string; value?: string }[];
  /** Which flow produced this lead — shapes the lead title. */
  kind?: 'quote' | 'sample';
  /** Present when enriching an already-created lead. */
  leadId?: number;
  /** Honeypot — bots fill this, humans don't. */
  website?: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  let body: QuoteLeadBody;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  // Silently accept honeypot hits so bots think they succeeded.
  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const company = body.company?.trim() ?? '';
  const phone = body.whatsapp?.trim() ?? '';
  const country = body.country?.trim() ?? '';
  const product = body.product?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!email || !EMAIL_RE.test(email)) {
    return jsonError('A valid email is required.', 400);
  }

  // Nothing to do (and no duplicate errors) if Odoo isn't wired up yet.
  if (!isOdooConfigured()) {
    return NextResponse.json({ ok: true, leadId: body.leadId ?? null, skipped: true });
  }

  const details: OdooDetail[] = [
    { label: 'Product', value: product },
    ...(body.specs ?? [])
      .filter((s): s is { label: string; value: string } =>
        Boolean(s && s.label && s.value))
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() })),
  ];

  const leadPrefix = body.kind === 'sample' ? 'Sample order' : 'Quote request';
  const leadName = `${leadPrefix}${product ? `: ${product}` : ''}${name ? ` — ${name}` : ''}`;

  const payload = {
    name: leadName,
    contactName: name,
    emailFrom: email,
    phone,
    company,
    country,
    message,
    details,
  };

  try {
    // Enrich the existing lead if the client already has an id, otherwise
    // create a fresh one and hand the id back.
    if (typeof body.leadId === 'number') {
      const ok = await updateOdooLead(body.leadId, payload);
      if (ok) {
        return NextResponse.json({ ok: true, leadId: body.leadId });
      }
      // The lead may have been deleted in Odoo — fall through to create a new one.
    }

    const leadId = await createOdooLead(payload);
    console.info('[quote-lead] Odoo lead created', leadId);
    return NextResponse.json({ ok: true, leadId });
  } catch (error) {
    console.error('[quote-lead] Odoo lead failed', error);
    return jsonError('We could not submit your quote request. Please try again.', 502);
  }
}
