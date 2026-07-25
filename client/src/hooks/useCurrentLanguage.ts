import { useState, useEffect } from "react";
import { STORAGE_KEY } from "@/lib/i18n";

// Tracks the visitor's active language and re-renders on every switch, so data
// fetched per-language (blog posts, which the admin can pre-translate) is
// refetched when the switcher changes. Copy that has no pre-translation is
// still handled by the DOM auto-translator.
export function useCurrentLanguage(): string {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "en";
    }
    return "en";
  });

  useEffect(() => {
    const sync = () => setLang(localStorage.getItem(STORAGE_KEY) || "en");
    window.addEventListener("storage", sync);
    window.addEventListener("vividpoly-lang-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vividpoly-lang-change", sync);
    };
  }, []);

  return lang;
}

export default useCurrentLanguage;
