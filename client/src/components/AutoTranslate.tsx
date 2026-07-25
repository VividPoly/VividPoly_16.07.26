import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { initAutoTranslate, applyLanguage, STORAGE_KEY } from "@/lib/i18n";

const LANG_LABEL: Record<string, string> = {
  es: "Español", pt: "Português", fr: "Français", ar: "العربية", hi: "हिन्दी",
  ja: "日本語", vi: "Tiếng Việt", th: "ไทย", id: "Bahasa", sw: "Kiswahili", zh: "中文",
};

// Mounted once at the app root. Sets up the site-wide auto-translator, re-applies
// the active language after each client-side route change, and shows a small
// indicator ONLY when a translation is genuinely slow (so fast, dictionary-backed
// translations never flash it).
export default function AutoTranslate() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState("en");
  const activeRef = useRef(0);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initAutoTranslate();

    const onBusy = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (d.lang) setLang(d.lang);
      if (d.active) {
        activeRef.current += 1;
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        // Only reveal if work is still going after a short grace period —
        // instant (cached/dictionary) translations finish before this fires.
        if (!showTimer.current && !visible) {
          showTimer.current = setTimeout(() => {
            showTimer.current = null;
            if (activeRef.current > 0) setVisible(true);
          }, 450);
        }
      } else {
        activeRef.current = Math.max(0, activeRef.current - 1);
        if (activeRef.current === 0) {
          if (showTimer.current) {
            clearTimeout(showTimer.current);
            showTimer.current = null;
          }
          // Small linger so it never blinks off the instant it appears.
          hideTimer.current = setTimeout(() => setVisible(false), 250);
        }
      }
    };

    window.addEventListener("vividpoly-translating", onBusy as EventListener);
    return () => {
      window.removeEventListener("vividpoly-translating", onBusy as EventListener);
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const active = localStorage.getItem(STORAGE_KEY) || "en";
    if (active !== "en") {
      const t = setTimeout(() => applyLanguage(active), 60);
      return () => clearTimeout(t);
    }
  }, [location]);

  if (!visible) return null;
  return (
    <div
      className="notranslate fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 rounded-full bg-[#1A1A1A] text-white text-sm px-4 py-2 shadow-lg"
      translate="no"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      Translating to {LANG_LABEL[lang] || lang.toUpperCase()}…
    </div>
  );
}
