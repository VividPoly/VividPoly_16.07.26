'use client';

// App-wide language state. On first load the active locale is resolved by the
// priority: (1) the user's saved preference, (2) the browser's preferred
// language (navigator.languages), (3) IP/region detection via /api/geo, (4)
// English (US). Only a MANUAL selection is persisted, so a saved preference
// always wins over auto-detection on later visits. The active `messages` are the
// English (US) base deep-merged with the locale's overrides, so untranslated
// keys always fall back to English.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LOCALE,
  LOCALE_MESSAGES,
  baseMessages,
  isSupportedLocale,
  localeForCountry,
  localeForBrowserLanguages,
  type LanguageOption,
} from '@/lib/i18n/locales';
import { deepMerge } from '@/lib/i18n/deep-merge';
import type { VividPolyMessages } from '@/lib/get-vividpoly-data';

const STORAGE_KEY = 'vp-locale';

type LocaleContextValue = {
  locale: string;
  setLocale: (code: string) => void;
  messages: VividPolyMessages;
  languages: LanguageOption[];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Saved manual preference, if still a supported language. */
function getSavedLocale(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && isSupportedLocale(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** The visitor's browser languages mapped to a supported locale, if any. */
function getBrowserLocale(): string | null {
  if (typeof navigator === 'undefined') return null;
  const langs =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];
  return localeForBrowserLanguages(langs);
}

/** Ask the server for the visitor's country (IP/CDN based) and map it to a locale. */
async function getRegionLocale(signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch('/api/geo', { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { country?: string | null };
    return data.country ? localeForCountry(data.country) : null;
  } catch {
    return null;
  }
}

function applyDocumentLocale(code: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code;
  // Keep the page layout LTR so the header, language switcher and nav never
  // move when switching language. RTL scripts (Arabic/Hebrew/Farsi) still
  // render their text right-to-left within each element via Unicode bidi.
  document.documentElement.dir = 'ltr';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Start at the default so server and first client render match; resolve the
  // real locale after mount to avoid a hydration mismatch.
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    const controller = new AbortController();

    // 1) Saved preference wins and is synchronous — apply immediately, no flash.
    const saved = getSavedLocale();
    if (saved) {
      setLocaleState(saved);
      applyDocumentLocale(saved);
      return () => controller.abort();
    }

    // 2) Browser language: the visitor's stated reading preference, also
    // synchronous, so apply it with no flash. This is the primary auto-detect.
    const browser = getBrowserLocale();
    if (browser) {
      setLocaleState(browser);
      applyDocumentLocale(browser);
      return () => controller.abort();
    }

    // 3) Browser language wasn't one we support — fall back to IP/region
    // detection, else 4) English (US).
    (async () => {
      const region = await getRegionLocale(controller.signal);
      if (controller.signal.aborted) return;
      const resolved = region ?? DEFAULT_LOCALE;
      setLocaleState(resolved);
      applyDocumentLocale(resolved);
    })();

    return () => controller.abort();
  }, []);

  // Manual selection: persist so future visits use it instead of IP detection.
  const setLocale = useCallback((code: string) => {
    if (!isSupportedLocale(code)) return;
    setLocaleState(code);
    applyDocumentLocale(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  }, []);

  const messages = useMemo(() => {
    if (locale === DEFAULT_LOCALE) return baseMessages as VividPolyMessages;
    return deepMerge(baseMessages as VividPolyMessages, LOCALE_MESSAGES[locale]);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, messages, languages: SUPPORTED_LANGUAGES }),
    [locale, setLocale, messages],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}

/** Convenience hook for components that only need the active messages. */
export function useLocaleMessages(): VividPolyMessages {
  return useLocale().messages;
}
