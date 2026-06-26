export type QuoteLeadPayload = {
  name: string;
  company?: string;
  email: string;
  whatsapp?: string;
  country?: string;
  capturedAt: string;
  source: 'quote-contact';
};

const STORAGE_KEY = 'vividpoly-quote-leads';

/** Persist lead contact details immediately, before bag specification. */
export function captureQuoteLead(contact: Omit<QuoteLeadPayload, 'capturedAt' | 'source'>): QuoteLeadPayload {
  const lead: QuoteLeadPayload = {
    ...contact,
    capturedAt: new Date().toISOString(),
    source: 'quote-contact',
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]') as QuoteLeadPayload[];
      existing.push(lead);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([lead]));
    }
  }

  return lead;
}
