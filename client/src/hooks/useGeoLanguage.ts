import { useState, useEffect } from "react";

interface GeoLanguageInfo {
  detectedCountry: string;
  detectedLanguage: string;
  languageName: string;
  shouldOfferTranslation: boolean;
}

// Supported non-English languages, keyed by the primary browser language code.
// If the browser's language is English (or not one of these), we never show the
// translation banner.
const SUPPORTED_LANGUAGES: Record<string, string> = {
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  ru: "Русский",
  tr: "Türkçe",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  hi: "हिन्दी",
  th: "ไทย",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  sw: "Kiswahili",
};

export function useGeoLanguage(): GeoLanguageInfo & { dismissTranslation: () => void } {
  const [info, setInfo] = useState<GeoLanguageInfo>({
    detectedCountry: "",
    detectedLanguage: "en",
    languageName: "English",
    shouldOfferTranslation: false,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respect a saved choice (dismissed or already picked a language).
    const saved = localStorage.getItem("vividpoly_lang_preference");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInfo((prev) => ({ ...prev, ...parsed, shouldOfferTranslation: false }));
      } catch {
        /* ignore */
      }
      return;
    }

    detectFromBrowser();
  }, []);

  // Detect from the visitor's own browser language preferences. The banner only
  // appears when the browser's preferred language is a supported NON-English
  // language; an English (or unsupported) browser sees nothing.
  const detectFromBrowser = () => {
    if (typeof navigator === "undefined") return;
    const langs =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];

    for (const raw of langs) {
      const primary = raw.toLowerCase().split("-")[0];
      if (primary === "en") return; // English browser -> no banner
      const name = SUPPORTED_LANGUAGES[primary];
      if (name) {
        setInfo({
          detectedCountry: "",
          detectedLanguage: primary,
          languageName: name,
          shouldOfferTranslation: true,
        });
        return;
      }
    }
    // No supported non-English preference -> stay silent.
  };

  const dismissTranslation = () => {
    setDismissed(true);
    setInfo((prev) => ({ ...prev, shouldOfferTranslation: false }));
    localStorage.setItem(
      "vividpoly_lang_preference",
      JSON.stringify({ detectedLanguage: "en", languageName: "English" }),
    );
  };

  return {
    ...info,
    shouldOfferTranslation: info.shouldOfferTranslation && !dismissed,
    dismissTranslation,
  };
}
