// Central registry for the site's languages. English (US) — src/data/ui-copy.json
// — is the complete base and the final fallback. Every other locale has a file in
// src/data/locales/<code>.json that OVERRIDES the base; missing keys fall back to
// English via deep-merge, so those files can be partial and filled in over time.
//
// ─── HOW TO ADD A LANGUAGE ──────────────────────────────────────────────────
// 1. Create src/data/locales/<code>.json (see that folder's README).
// 2. Import it below and add it to LOCALE_MESSAGES.
// 3. Add an entry to SUPPORTED_LANGUAGES (code + English label + native label).
// 4. Optionally map countries to it in COUNTRY_TO_LOCALE, and add to RTL_LOCALES
//    if it is right-to-left.
// ────────────────────────────────────────────────────────────────────────────

import baseMessages from '@/data/ui-copy.json';

import enGB from '@/data/locales/en-GB.json';
import enAU from '@/data/locales/en-AU.json';
import enIN from '@/data/locales/en-IN.json';
import enSG from '@/data/locales/en-SG.json';
import fr from '@/data/locales/fr.json';
import de from '@/data/locales/de.json';
import es from '@/data/locales/es.json';
import it from '@/data/locales/it.json';
import pt from '@/data/locales/pt.json';
import nl from '@/data/locales/nl.json';
import pl from '@/data/locales/pl.json';
import ru from '@/data/locales/ru.json';
import ar from '@/data/locales/ar.json';
import fa from '@/data/locales/fa.json';
import he from '@/data/locales/he.json';
import tr from '@/data/locales/tr.json';
import sw from '@/data/locales/sw.json';
import ha from '@/data/locales/ha.json';
import am from '@/data/locales/am.json';
import zhHans from '@/data/locales/zh-Hans.json';
import zhHant from '@/data/locales/zh-Hant.json';
import hi from '@/data/locales/hi.json';
import gu from '@/data/locales/gu.json';
import mr from '@/data/locales/mr.json';
import ta from '@/data/locales/ta.json';
import te from '@/data/locales/te.json';
import kn from '@/data/locales/kn.json';
import bn from '@/data/locales/bn.json';
import pa from '@/data/locales/pa.json';
import ml from '@/data/locales/ml.json';
import id from '@/data/locales/id.json';
import ms from '@/data/locales/ms.json';
import th from '@/data/locales/th.json';

export type LanguageOption = {
  /** BCP-47 code, e.g. "en-US", "zh-Hans", "fr". */
  code: string;
  /** English name (accessibility / reference). */
  label: string;
  /** Name shown in the switcher, written in the language itself. */
  nativeLabel: string;
};

/** Default language: used before detection and as the ultimate fallback. */
export const DEFAULT_LOCALE = 'en-US';

/** Right-to-left locales — the page gets dir="rtl" for these. */
export const RTL_LOCALES = new Set(['ar', 'fa', 'he']);

/** Every language offered in the switcher. */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English (US)', nativeLabel: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)', nativeLabel: 'English (UK)' },
  { code: 'en-AU', label: 'English (Australia)', nativeLabel: 'English (Australia)' },
  { code: 'en-IN', label: 'English (India)', nativeLabel: 'English (India)' },
  { code: 'en-SG', label: 'English (Singapore)', nativeLabel: 'English (Singapore)' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'fa', label: 'Persian (Farsi)', nativeLabel: 'فارسی' },
  { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' },
  { code: 'zh-Hans', label: 'Chinese (Simplified)', nativeLabel: '简体中文' },
  { code: 'zh-Hant', label: 'Chinese (Traditional)', nativeLabel: '繁體中文' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Malay', nativeLabel: 'Bahasa Melayu' },
  { code: 'th', label: 'Thai', nativeLabel: 'ไทย' },
];

/**
 * Override messages per non-default locale (English (US) is the base and is not
 * listed here). Placeholder files are empty {} today and fall back to English.
 */
export const LOCALE_MESSAGES: Record<string, unknown> = {
  'en-GB': enGB, 'en-AU': enAU, 'en-IN': enIN, 'en-SG': enSG,
  fr, de, es, it, pt, nl, pl, ru,
  ar, fa, he, tr,
  sw, ha, am,
  'zh-Hans': zhHans, 'zh-Hant': zhHant,
  hi, gu, mr, ta, te, kn, bn, pa, ml,
  id, ms, th,
};

/** The complete English (US) message set every locale falls back to. */
export { baseMessages };

/**
 * ISO 3166-1 alpha-2 country → locale. Used for IP/region detection. Countries
 * not listed fall back to English (US). Sub-national languages (e.g. India's
 * regional languages) can't be inferred from a country code, so India maps to
 * English (India) and users pick a regional language manually.
 */
export const COUNTRY_TO_LOCALE: Record<string, string> = {
  // English
  US: 'en-US', CA: 'en-US', PH: 'en-US',
  GB: 'en-GB', IE: 'en-GB',
  AU: 'en-AU', NZ: 'en-AU',
  IN: 'en-IN',
  SG: 'en-SG',
  // Europe
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr',
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  ES: 'es', IT: 'it', SM: 'it',
  PT: 'pt', NL: 'nl', PL: 'pl',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  // Latin America
  MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es',
  NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  BR: 'pt',
  // Middle East
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
  JO: 'ar', IQ: 'ar', LB: 'ar', SY: 'ar', YE: 'ar', PS: 'ar',
  IR: 'fa', IL: 'he', TR: 'tr',
  // Africa
  LY: 'ar', DZ: 'ar', MA: 'ar', TN: 'ar', SD: 'ar', MR: 'ar',
  KE: 'sw', TZ: 'sw', UG: 'sw', RW: 'sw',
  CD: 'fr', CI: 'fr', SN: 'fr', CM: 'fr', ML: 'fr', BF: 'fr',
  NG: 'ha', NE: 'ha',
  ET: 'am', ER: 'am',
  AO: 'pt', MZ: 'pt',
  GH: 'en-GB', ZA: 'en-GB',
  // China
  CN: 'zh-Hans', TW: 'zh-Hant', HK: 'zh-Hant', MO: 'zh-Hant',
  // Southeast Asia
  ID: 'id', MY: 'ms', BN: 'ms', TH: 'th',
};

const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

export function isSupportedLocale(code: string): boolean {
  return SUPPORTED_CODES.has(code);
}

export function isRtlLocale(code: string): boolean {
  return RTL_LOCALES.has(code);
}

/** Map a detected country code to a supported locale, or null if unmapped. */
export function localeForCountry(country: string): string | null {
  const mapped = COUNTRY_TO_LOCALE[country.toUpperCase()];
  return mapped && isSupportedLocale(mapped) ? mapped : null;
}

/** Resolve one BCP-47 browser tag (e.g. "pt-BR", "zh-TW", "en-GB") to a
 * supported locale, or null. Region/script variants collapse to their base
 * language, except where we offer distinct variants (English regions, the two
 * Chinese scripts). */
function localeForBrowserTag(tag: string): string | null {
  if (!tag) return null;
  const [primary, ...rest] = tag.split('-');
  const lang = primary.toLowerCase();
  const subtags = rest.map((s) => s.toLowerCase());

  // Chinese: choose the script from an explicit script subtag or the region.
  if (lang === 'zh') {
    const traditional =
      subtags.includes('hant') || ['tw', 'hk', 'mo'].some((r) => subtags.includes(r));
    return traditional ? 'zh-Hant' : 'zh-Hans';
  }

  // English: keep a regional variant we actually offer, else English (US).
  if (lang === 'en') {
    const region = subtags.find((s) => s.length === 2);
    const variant = region ? `en-${region.toUpperCase()}` : null;
    return variant && isSupportedLocale(variant) ? variant : DEFAULT_LOCALE;
  }

  // Everything else uses the base language if we support it.
  return isSupportedLocale(lang) ? lang : null;
}

/**
 * Map the browser's preferred languages (navigator.languages, most-preferred
 * first) to the first one we support, or null if none match. This reflects what
 * the visitor set their browser to read in — a stronger signal than their IP
 * region — so it takes priority over geo detection.
 */
export function localeForBrowserLanguages(langs: readonly string[]): string | null {
  for (const tag of langs) {
    const resolved = localeForBrowserTag(tag);
    if (resolved) return resolved;
  }
  return null;
}
