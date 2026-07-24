import { useEffect } from "react";
import { useLocation } from "wouter";
import { initAutoTranslate, applyLanguage, STORAGE_KEY } from "@/lib/i18n";

// Mounted once at the app root. Sets up the site-wide auto-translator and
// re-applies the active language after each client-side route change (the
// MutationObserver covers async content; this covers full page swaps).
export default function AutoTranslate() {
  const [location] = useLocation();

  useEffect(() => {
    initAutoTranslate();
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem(STORAGE_KEY) || "en";
    if (lang !== "en") {
      const t = setTimeout(() => applyLanguage(lang), 60);
      return () => clearTimeout(t);
    }
  }, [location]);

  return null;
}
