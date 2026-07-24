// Site-wide auto-translation. The whole site is authored in English; when a
// visitor picks another language (or their browser default is a supported
// non-English language on first visit) we translate the rendered DOM in place.
//
// How it works:
//   - We remember each text node / attribute's ORIGINAL English string, so we
//     can switch between any languages (and back to English) losslessly.
//   - Unique strings are looked up in a localStorage cache first, then the
//     server /api/trpc/i18n.translate endpoint (which itself caches in
//     Supabase). Anything that can't be translated stays English.
//   - A MutationObserver re-translates content added after route changes.

export const STORAGE_KEY = "vividpoly-lang";
const PREF_KEY = "vividpoly_lang_preference"; // shared with the geo banner

// Languages offered in the header switcher.
export const SUPPORTED_LANGS = [
  "en", "es", "pt", "fr", "ar", "hi", "ja", "vi", "th", "id", "sw", "zh",
];
const RTL_LANGS = new Set(["ar", "fa", "he", "ur"]);

// Elements whose text must never be translated.
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "KBD", "SAMP",
]);
const TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label", "alt"];

// Remember originals so re-translation always starts from the English source.
const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Record<string, string>>();

let currentLang = "en";
let observer: MutationObserver | null = null;
let scheduled = false;

function getCache(lang: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(`vp-tr-${lang}`) || "{}");
  } catch {
    return {};
  }
}
function mergeCache(lang: string, map: Record<string, string>) {
  try {
    const cur = getCache(lang);
    localStorage.setItem(`vp-tr-${lang}`, JSON.stringify({ ...cur, ...map }));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

// Only translate strings that actually contain words.
function translatable(s: string): boolean {
  if (!s) return false;
  const t = s.trim();
  if (t.length < 2) return false;
  if (!/[A-Za-z]/.test(t)) return false; // numbers, symbols, arrows
  if (/^[\w.+-]+@[\w.-]+$/.test(t)) return false; // emails
  if (/^https?:\/\//i.test(t)) return false; // urls
  return true;
}

function skip(el: Element | null): boolean {
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.getAttribute("translate") === "no") return true;
    if (el.hasAttribute("data-no-translate")) return true;
    if (el.classList && el.classList.contains("notranslate")) return true;
    el = el.parentElement;
  }
  return false;
}

type Recorded = { apply: (v: string) => void; source: string };

// Walk a subtree collecting translatable text nodes and attributes, recording
// each one's original English value the first time it's seen.
function collect(root: Node): Recorded[] {
  const items: Recorded[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue || "";
      if (!translatable(text)) return NodeFilter.FILTER_REJECT;
      if (skip((node as Text).parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n = walker.nextNode();
  while (n) {
    const tn = n as Text;
    if (!originalText.has(tn)) originalText.set(tn, tn.nodeValue || "");
    const source = originalText.get(tn)!;
    if (translatable(source)) {
      items.push({ source: source.trim(), apply: (v) => { tn.nodeValue = v; } });
    }
    n = walker.nextNode();
  }

  // Attributes on the root (if element) and its descendants.
  const elements: Element[] = [];
  if (root instanceof Element) elements.push(root);
  if (root instanceof Element || root instanceof Document) {
    (root as Element).querySelectorAll?.("*").forEach((el) => elements.push(el));
  }
  for (const el of elements) {
    if (skip(el)) continue;
    for (const attr of TRANSLATABLE_ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      let store = originalAttr.get(el);
      if (!store) {
        store = {};
        originalAttr.set(el, store);
      }
      if (!(attr in store)) store[attr] = el.getAttribute(attr) || "";
      const source = store[attr];
      if (translatable(source)) {
        items.push({ source: source.trim(), apply: (v) => el.setAttribute(attr, v) });
      }
    }
  }

  return items;
}

async function requestTranslations(texts: string[], target: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`/api/trpc/i18n.translate?batch=1`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ "0": { json: { texts, target } } }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data?.[0]?.result?.data?.json || {};
  } catch {
    return {};
  }
}

function restoreEnglish(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let n = walker.nextNode();
  while (n) {
    const tn = n as Text;
    const orig = originalText.get(tn);
    if (orig !== undefined) tn.nodeValue = orig;
    n = walker.nextNode();
  }
  const scope = root instanceof Element ? root : document.body;
  scope.querySelectorAll?.("*").forEach((el) => {
    const store = originalAttr.get(el);
    if (store) for (const [attr, val] of Object.entries(store)) el.setAttribute(attr, val);
  });
}

async function translate(root: Node, lang: string) {
  const items = collect(root);
  if (items.length === 0) return;

  const cache = getCache(lang);
  const sources = Array.from(new Set(items.map((i) => i.source)));
  const missing = sources.filter((s) => cache[s] === undefined);

  if (missing.length > 0) {
    const fetched = await requestTranslations(missing, lang);
    // Only cache genuine translations; leave English strings uncached so a
    // transient failure can be retried later.
    const good: Record<string, string> = {};
    for (const s of missing) {
      const v = fetched[s];
      if (v && v !== s) good[s] = v;
    }
    mergeCache(lang, good);
    Object.assign(cache, good);
  }

  // Re-collect in case the DOM changed while awaiting, then apply.
  for (const item of collect(root)) {
    const v = cache[item.source];
    if (v) item.apply(v);
  }
}

function applyDir(lang: string) {
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
}

// Public: switch the whole page to `lang`.
export async function applyLanguage(lang: string) {
  currentLang = lang;
  applyDir(lang);
  if (lang === "en") {
    restoreEnglish(document.body);
    return;
  }
  await translate(document.body, lang);
}

function scheduleRetranslate() {
  if (scheduled || currentLang === "en") return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    translate(document.body, currentLang);
  }, 250);
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        scheduleRetranslate();
        return;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Decide the initial language: an explicit saved choice wins; otherwise the
// browser's primary language, if it's a supported non-English one, auto-applies.
export function initialLanguage(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of langs) {
      const primary = (raw || "").toLowerCase().split("-")[0];
      if (primary === "en") return "en";
      if (SUPPORTED_LANGS.includes(primary)) {
        // Persist so the choice sticks and the geo banner stays quiet.
        localStorage.setItem(STORAGE_KEY, primary);
        localStorage.setItem(PREF_KEY, JSON.stringify({ detectedLanguage: primary }));
        return primary;
      }
    }
  } catch {
    /* ignore */
  }
  return "en";
}

// Wire everything up once, from the app root.
export function initAutoTranslate() {
  if (typeof window === "undefined") return;
  currentLang = initialLanguage();
  startObserver();
  applyDir(currentLang);
  if (currentLang !== "en") {
    // Let the first render paint, then translate.
    setTimeout(() => applyLanguage(currentLang), 0);
  }
  window.addEventListener("vividpoly-lang-change", () => {
    const lang = localStorage.getItem(STORAGE_KEY) || "en";
    applyLanguage(lang);
  });
}
