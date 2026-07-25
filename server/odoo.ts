// Odoo CRM integration — creates/updates crm.lead (opportunity) records for
// website enquiries. This runs ONLY on the server: the API key must never
// reach the browser. It talks to Odoo Online over its JSON-RPC endpoint, so no
// extra XML-RPC dependency is needed — plain fetch is enough.
//
// This is the single, reusable Odoo module. Every form / API route goes
// through createOdooLead()/updateOdooLead() so the integration lives in one
// place.

export type OdooConfig = {
  url: string;
  db: string;
  username: string;
  apiKey: string;
};

/** A labelled detail line (e.g. bag spec) to store on the lead. */
export type OdooDetail = { label: string; value: string };

export type OdooLeadPayload = {
  /** Lead / opportunity title shown in the CRM pipeline. */
  name: string;
  /** Person's name from the form. */
  contactName?: string;
  /** Email from the form. */
  emailFrom?: string;
  /** Phone / WhatsApp from the form. */
  phone?: string;
  /** Company name from the form (mapped to the crm.lead partner_name field). */
  company?: string;
  /**
   * Country text from the form. Best-effort resolved to Odoo's real country_id
   * (so leads are filterable by country); always also shown in the description
   * as a fallback for values Odoo can't match.
   */
  country?: string;
  /** The visitor's free-text message. */
  message?: string;
  /**
   * Any extra labelled details (Country, Enquiry Type, Product, Bag
   * Specifications, Quantity, Material, Print, etc.). Odoo has no dedicated
   * field for most of these, so they are recorded in the lead description.
   */
  details?: OdooDetail[];
};

export function getOdooConfig(): OdooConfig | null {
  const url = process.env.ODOO_URL?.trim().replace(/\/$/, '');
  const db = process.env.ODOO_DATABASE?.trim();
  const username = process.env.ODOO_USERNAME?.trim();
  const apiKey = process.env.ODOO_API_KEY?.trim();

  if (!url || !db || !username || !apiKey) {
    return null;
  }
  return { url, db, username, apiKey };
}

export function isOdooConfigured() {
  return getOdooConfig() !== null;
}

/** One JSON-RPC round trip to Odoo, with a timeout so a form never hangs. */
async function odooJsonRpc(
  endpoint: string,
  params: Record<string, unknown>,
  timeoutMs = 12000,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${endpoint}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params,
        id: Date.now(),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Odoo HTTP ${res.status}`);
    }

    const data = (await res.json()) as {
      result?: unknown;
      error?: { message?: string; data?: { message?: string } };
    };

    if (data.error) {
      throw new Error(
        data.error.data?.message || data.error.message || 'Odoo RPC error',
      );
    }
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

/** Authenticate with the API key (used in place of the password) → numeric uid. */
async function odooAuthenticate(config: OdooConfig): Promise<number> {
  const uid = await odooJsonRpc(config.url, {
    service: 'common',
    method: 'authenticate',
    args: [config.db, config.username, config.apiKey, {}],
  });
  if (!uid || typeof uid !== 'number') {
    throw new Error(
      'Odoo authentication failed — check ODOO_USERNAME / ODOO_API_KEY / ODOO_DATABASE.',
    );
  }
  return uid;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the description so no submitted detail is lost on the lead. crm.lead's
 * description is an HTML field, so we escape each line and join with <br/> —
 * otherwise newlines collapse and everything renders on one line in Odoo.
 */
function buildLeadDescription(payload: OdooLeadPayload): string {
  const lines = [
    payload.contactName?.trim() ? `Name: ${payload.contactName.trim()}` : '',
    payload.company?.trim() ? `Company: ${payload.company.trim()}` : '',
    payload.emailFrom?.trim() ? `Email: ${payload.emailFrom.trim()}` : '',
    payload.phone?.trim() ? `Phone / WhatsApp: ${payload.phone.trim()}` : '',
    payload.country?.trim() ? `Country: ${payload.country.trim()}` : '',
    ...(payload.details ?? [])
      .filter((d) => d && d.label && d.value?.toString().trim())
      .map((d) => `${d.label}: ${d.value.toString().trim()}`),
  ].filter(Boolean);

  const text = [
    ...lines,
    '',
    payload.message?.trim() ? `Message:\n${payload.message.trim()}` : '(no message)',
    '',
    '—',
    'Submitted via vividpoly.com',
  ].join('\n');

  // Escape once, then turn every newline (including any inside the visitor's
  // message) into <br/> so the HTML field renders on multiple lines.
  return escapeHtml(text).replace(/\r?\n/g, '<br/>');
}

/** Best-effort: resolve a free-text country name to Odoo's res.country id. */
async function resolveCountryId(
  config: OdooConfig,
  uid: number,
  name: string,
): Promise<number | null> {
  const query = name.trim();
  if (!query) return null;
  try {
    const ids = await odooJsonRpc(config.url, {
      service: 'object',
      method: 'execute_kw',
      // =ilike = case-insensitive exact match; unmatched values (e.g. "USA")
      // simply stay in the description.
      args: [config.db, uid, config.apiKey, 'res.country', 'search', [[['name', '=ilike', query]]], { limit: 1 }],
    });
    if (Array.isArray(ids) && typeof ids[0] === 'number') return ids[0];
  } catch (error) {
    console.error('[odoo] country lookup failed', error);
  }
  return null;
}

/** Map a payload to the crm.lead field set Odoo expects. */
function toLeadFields(
  payload: OdooLeadPayload,
  countryId: number | null,
): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    type: 'opportunity',
    name: payload.name,
    description: buildLeadDescription(payload),
  };
  if (payload.contactName?.trim()) fields.contact_name = payload.contactName.trim();
  if (payload.emailFrom?.trim()) fields.email_from = payload.emailFrom.trim();
  if (payload.phone?.trim()) fields.phone = payload.phone.trim();
  if (payload.company?.trim()) fields.partner_name = payload.company.trim();
  if (countryId) fields.country_id = countryId;
  return fields;
}

/**
 * Create a crm.lead (opportunity) in Odoo. Returns the new record id.
 * Throws if Odoo is not configured, auth fails, or the create fails — callers
 * decide whether that surfaces to the visitor.
 */
export async function createOdooLead(payload: OdooLeadPayload): Promise<number> {
  const config = getOdooConfig();
  if (!config) throw new Error('ODOO_NOT_CONFIGURED');

  const uid = await odooAuthenticate(config);
  const countryId = payload.country ? await resolveCountryId(config, uid, payload.country) : null;
  const result = await odooJsonRpc(config.url, {
    service: 'object',
    method: 'execute_kw',
    args: [config.db, uid, config.apiKey, 'crm.lead', 'create', [toLeadFields(payload, countryId)]],
  });

  if (typeof result !== 'number') {
    throw new Error('Odoo did not return a lead id.');
  }
  return result;
}

/**
 * Update an existing crm.lead (e.g. enrich a quote lead with bag specs once the
 * visitor finishes the wizard). Returns true on success.
 */
export async function updateOdooLead(
  id: number,
  payload: OdooLeadPayload,
): Promise<boolean> {
  const config = getOdooConfig();
  if (!config) throw new Error('ODOO_NOT_CONFIGURED');

  const uid = await odooAuthenticate(config);
  const countryId = payload.country ? await resolveCountryId(config, uid, payload.country) : null;
  const result = await odooJsonRpc(config.url, {
    service: 'object',
    method: 'execute_kw',
    args: [config.db, uid, config.apiKey, 'crm.lead', 'write', [[id], toLeadFields(payload, countryId)]],
  });
  return result === true;
}
