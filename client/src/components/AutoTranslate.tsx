import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { initAutoTranslate, applyLanguage, STORAGE_KEY } from "@/lib/i18n";

const LANG_LABEL: Record<string, string> = {
  es: "Español", pt: "Português", fr: "Français", ar: "العربية", hi: "हिन्दी",
  ja: "日本語", vi: "Tiếng Việt", th: "ไทย", id: "Bahasa", sw: "Kiswahili", zh: "中文",
};

// Mounted once at the app root. Sets up the site-wide auto-translator, re-applies
// the active language after each client-side route change, and shows a small
// indicator while a first-time translation is being fetched.
export default function AutoTranslate() {
  const [location] = useLocation();
  const [busy, setBusy] = useState<{ active: boolean; lang: string }>({ active: false, lang: "en" });

  useEffect(() => {
    initAutoTranslate();
    const onBusy = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setBusy({ active: !!d.active, lang: d.lang || "en" });
    };
    window.addEventListener("vividpoly-translating", onBusy as EventListener);
    return () => window.removeEventListener("vividpoly-translating", onBusy as EventListener);
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem(STORAGE_KEY) || "en";
    if (lang !== "en") {
      const t = setTimeout(() => applyLanguage(lang), 60);
      return () => clearTimeout(t);
    }
  }, [location]);

  if (!busy.active) return null;
  return (
    <div
      className="notranslate fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 rounded-full bg-[#1A1A1A] text-white text-sm px-4 py-2 shadow-lg"
      translate="no"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      Translating to {LANG_LABEL[busy.lang] || busy.lang.toUpperCase()}…
    </div>
  );
}
