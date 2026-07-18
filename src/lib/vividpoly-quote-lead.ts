// Client-side helper: sends the "Get a Quote" data to the /api/quote-lead
// backend, which creates (or enriches) the Odoo CRM lead. Best-effort — it
// never throws, so the visitor's flow is never blocked. Returns the lead id so
// the caller can enrich the same lead later instead of creating a duplicate.

export type QuoteLeadInput = {
  name?: string;
  company?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  product?: string;
  message?: string;
  specs?: { label: string; value: string }[];
  /** Which flow produced this lead — shapes the lead title in Odoo. */
  kind?: 'quote' | 'sample';
  /** Pass the id from a previous call to update that lead in place. */
  leadId?: number;
};

export async function submitQuoteLead(input: QuoteLeadInput): Promise<number | null> {
  try {
    const res = await fetch('/api/quote-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, website: '' }),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; leadId?: number | null }
      | null;

    if (res.ok && data?.ok && typeof data.leadId === 'number') {
      return data.leadId;
    }
  } catch {
    // ignore — keep the id we already had (if any)
  }
  return input.leadId ?? null;
}
