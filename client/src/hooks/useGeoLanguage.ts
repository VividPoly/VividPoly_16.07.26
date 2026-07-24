import { useState, useEffect } from "react";

interface GeoLanguageInfo {
  detectedCountry: string;
  detectedLanguage: string;
  languageName: string;
  shouldOfferTranslation: boolean;
}

// Map countries to their primary languages
const COUNTRY_LANGUAGE_MAP: Record<string, { code: string; name: string }> = {
  // Latin America - Spanish
  AR: { code: "es", name: "Español" },
  CL: { code: "es", name: "Español" },
  CO: { code: "es", name: "Español" },
  PE: { code: "es", name: "Español" },
  MX: { code: "es", name: "Español" },
  EC: { code: "es", name: "Español" },
  VE: { code: "es", name: "Español" },
  UY: { code: "es", name: "Español" },
  PY: { code: "es", name: "Español" },
  BO: { code: "es", name: "Español" },
  // Brazil - Portuguese
  BR: { code: "pt", name: "Português" },
  // West Africa - French
  CI: { code: "fr", name: "Français" },
  SN: { code: "fr", name: "Français" },
  CM: { code: "fr", name: "Français" },
  ML: { code: "fr", name: "Français" },
  BF: { code: "fr", name: "Français" },
  NE: { code: "fr", name: "Français" },
  GN: { code: "fr", name: "Français" },
  TG: { code: "fr", name: "Français" },
  BJ: { code: "fr", name: "Français" },
  CD: { code: "fr", name: "Français" },
  CG: { code: "fr", name: "Français" },
  GA: { code: "fr", name: "Français" },
  // Japan
  JP: { code: "ja", name: "日本語" },
  // Arabic-speaking
  AE: { code: "ar", name: "العربية" },
  SA: { code: "ar", name: "العربية" },
  QA: { code: "ar", name: "العربية" },
  KW: { code: "ar", name: "العربية" },
  OM: { code: "ar", name: "العربية" },
  BH: { code: "ar", name: "العربية" },
  EG: { code: "ar", name: "العربية" },
  // Hindi
  IN: { code: "hi", name: "हिन्दी" },
  // Thai
  TH: { code: "th", name: "ไทย" },
  // Vietnamese
  VN: { code: "vi", name: "Tiếng Việt" },
  // Indonesian
  ID: { code: "id", name: "Bahasa Indonesia" },
  // Korean
  KR: { code: "ko", name: "한국어" },
  // Swahili (East Africa)
  KE: { code: "sw", name: "Kiswahili" },
  TZ: { code: "sw", name: "Kiswahili" },
  UG: { code: "sw", name: "Kiswahili" },
};

// Countries where English is primary (no translation needed)
const ENGLISH_COUNTRIES = new Set([
  "US", "GB", "AU", "NZ", "CA", "IE", "ZA", "NG", "GH", "PH", "SG", "MY",
]);

export function useGeoLanguage(): GeoLanguageInfo & { dismissTranslation: () => void } {
  const [info, setInfo] = useState<GeoLanguageInfo>({
    detectedCountry: "",
    detectedLanguage: "en",
    languageName: "English",
    shouldOfferTranslation: false,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed or chose a language
    const saved = localStorage.getItem("vividpoly_lang_preference");
    if (saved) {
      const parsed = JSON.parse(saved);
      setInfo(prev => ({ ...prev, ...parsed, shouldOfferTranslation: false }));
      return;
    }

    // Use timezone-based detection as a fallback (no API needed)
    detectCountryFromTimezone();
  }, []);

  const detectCountryFromTimezone = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const countryCode = timezoneToCountry(timezone);
      
      if (countryCode && !ENGLISH_COUNTRIES.has(countryCode)) {
        const langInfo = COUNTRY_LANGUAGE_MAP[countryCode];
        if (langInfo) {
          setInfo({
            detectedCountry: countryCode,
            detectedLanguage: langInfo.code,
            languageName: langInfo.name,
            shouldOfferTranslation: true,
          });
        }
      }
    } catch {
      // Silently fail - default to English
    }
  };

  const dismissTranslation = () => {
    setDismissed(true);
    setInfo(prev => ({ ...prev, shouldOfferTranslation: false }));
    localStorage.setItem("vividpoly_lang_preference", JSON.stringify({ 
      detectedLanguage: "en", 
      languageName: "English" 
    }));
  };

  return { ...info, shouldOfferTranslation: info.shouldOfferTranslation && !dismissed, dismissTranslation };
}

// Map common timezones to country codes
function timezoneToCountry(timezone: string): string {
  const tzMap: Record<string, string> = {
    "America/Argentina/Buenos_Aires": "AR",
    "America/Santiago": "CL",
    "America/Bogota": "CO",
    "America/Lima": "PE",
    "America/Mexico_City": "MX",
    "America/Sao_Paulo": "BR",
    "America/Caracas": "VE",
    "America/Guayaquil": "EC",
    "Africa/Abidjan": "CI",
    "Africa/Dakar": "SN",
    "Africa/Douala": "CM",
    "Africa/Bamako": "ML",
    "Africa/Ouagadougou": "BF",
    "Africa/Niamey": "NE",
    "Africa/Nairobi": "KE",
    "Africa/Dar_es_Salaam": "TZ",
    "Africa/Kampala": "UG",
    "Africa/Lagos": "NG",
    "Africa/Accra": "GH",
    "Africa/Cairo": "EG",
    "Asia/Tokyo": "JP",
    "Asia/Dubai": "AE",
    "Asia/Riyadh": "SA",
    "Asia/Qatar": "QA",
    "Asia/Kolkata": "IN",
    "Asia/Calcutta": "IN",
    "Asia/Bangkok": "TH",
    "Asia/Ho_Chi_Minh": "VN",
    "Asia/Jakarta": "ID",
    "Asia/Seoul": "KR",
    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Pacific/Auckland": "NZ",
    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Los_Angeles": "US",
    "America/Denver": "US",
    "Europe/London": "GB",
    "America/Toronto": "CA",
    "Asia/Singapore": "SG",
    "Asia/Kuala_Lumpur": "MY",
    "Asia/Manila": "PH",
    "Africa/Johannesburg": "ZA",
  };
  return tzMap[timezone] || "";
}
