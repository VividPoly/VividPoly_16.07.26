import { NextResponse, type NextRequest } from 'next/server';

// Region detection for the language auto-selection. Resolves the visitor's
// country WITHOUT any browser-language sniffing:
//   1. Hosting/CDN geo headers (Vercel, Cloudflare, etc.) — free, no external
//      call, and the visitor's IP never leaves our infrastructure.
//   2. Fallback: a server-side IP geolocation lookup (only if no geo header is
//      present, e.g. self-hosted without a CDN). Disable by setting
//      GEO_IP_LOOKUP=off. The lookup runs server-to-server; the browser never
//      talks to the third party directly.
// Returns { country: "US" | null }. The client maps the country to a locale.

export const runtime = 'nodejs';

function countryFromHeaders(req: NextRequest): string | null {
  const headerNames = [
    'x-vercel-ip-country',
    'cf-ipcountry',
    'x-country-code',
    'x-geo-country',
    'x-appengine-country',
  ];
  for (const name of headerNames) {
    const value = req.headers.get(name);
    if (value && /^[A-Za-z]{2}$/.test(value)) return value.toUpperCase();
  }
  return null;
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

function isPublicIp(ip: string): boolean {
  return !/^(10\.|127\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc00:|fe80:)/i.test(ip);
}

async function countryFromIpLookup(ip: string): Promise<string | null> {
  if (process.env.GEO_IP_LOOKUP === 'off') return null;
  if (!isPublicIp(ip)) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`,
      { signal: controller.signal, headers: { accept: 'application/json' } },
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { success?: boolean; country_code?: string };
    if (data.success && data.country_code && /^[A-Za-z]{2}$/.test(data.country_code)) {
      return data.country_code.toUpperCase();
    }
  } catch {
    /* network/timeout — fall through to null */
  }
  return null;
}

export async function GET(req: NextRequest) {
  let country = countryFromHeaders(req);
  if (!country) {
    const ip = clientIp(req);
    if (ip) country = await countryFromIpLookup(ip);
  }
  return NextResponse.json(
    { country },
    // Cache per-visitor for an hour; region rarely changes within a session.
    { headers: { 'Cache-Control': 'private, max-age=3600' } },
  );
}
