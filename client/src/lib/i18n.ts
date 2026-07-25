// Site-wide auto-translation. The whole site is authored in English; when a
// visitor picks another language we translate the rendered DOM in place — every
// text node and translatable attribute, including body copy, footer text, form
// placeholders, dialogs, and blog articles loaded from the admin at runtime.
//
// How it works:
//   - We remember each text node / attribute's ORIGINAL English string, so we
//     can switch between any languages (and back to English) losslessly.
//   - Strings resolve from a localStorage cache, then a pre-generated
//     dictionary (public/i18n/<lang>.json), then the server endpoint. The first
//     two are synchronous-ish and cover the whole static site, so a click
//     repaints immediately; only genuinely new copy (fresh blog posts) waits on
//     the network.
//   - A MutationObserver re-translates content added after route changes, so
//     async content (blog bodies, popups) is picked up automatically.

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

// How many strings per network request, and how many requests in flight. Small
// batches come back fast and apply progressively, so long pages fill in visibly
// rather than blocking on one huge request (which used to exceed the endpoint's
// limit and fail outright).
const BATCH_SIZE = 60;
const CONCURRENCY = 3;

// Remember originals so re-translation always starts from the English source.
const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Record<string, string>>();

let currentLang = "en";
let observer: MutationObserver | null = null;
let scheduled = false;
// Bumped on every language switch so a slow in-flight pass for the previous
// language can detect it is stale and stop writing to the DOM.
let generation = 0;

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

// The page <title> lives outside <body>, so the tree walker never sees it and
// the browser tab stayed English. Track it separately: anything we did not
// write ourselves is a fresh English title from the router's SEO head.
let lastWrittenTitle = "";
let titleSource = "";

function titleItem(): Recorded | null {
  const current = document.title || "";
  if (current && current !== lastWrittenTitle) titleSource = current;
  if (!translatable(titleSource)) return null;
  return {
    source: titleSource.trim(),
    apply: (v) => {
      document.title = v;
      lastWrittenTitle = v;
    },
  };
}

// Walk a subtree collecting translatable text nodes and attributes, recording
// each one's original English value the first time it's seen. Called once per
// pass — the returned handles are reused for every round of results, so a
// translation never costs more than a single DOM walk.
function collect(root: Node): Recorded[] {
  const items: Recorded[] = [];

  const title = titleItem();
  if (title) items.push(title);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Judge by the stored English original when we have one — otherwise a
      // node already showing a non-Latin language (e.g. Hindi) would be
      // rejected and couldn't be switched to another language.
      const known = originalText.get(node as Text);
      const text = known !== undefined ? known : node.nodeValue || "";
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

type BatchResult = { translations: Record<string, string>; untranslatable: string[] };

async function requestTranslations(texts: string[], target: string): Promise<BatchResult | null> {
  try {
    const res = await fetch(`/api/trpc/i18n.translate?batch=1`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ "0": { json: { texts, target } } }),
    });
    if (!res.ok) return null; // transport failure — caller must not blacklist
    const data = await res.json();
    const payload = data?.[0]?.result?.data?.json;
    if (!payload || typeof payload !== "object") return null;
    return {
      translations: payload.translations || {},
      untranslatable: Array.isArray(payload.untranslatable) ? payload.untranslatable : [],
    };
  } catch {
    return null;
  }
}

function restoreEnglish(root: Node) {
  if (titleSource) {
    document.title = titleSource;
    lastWrittenTitle = titleSource;
  }
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

// Pre-generated dictionaries (public/i18n/<lang>.json) give instant, offline
// translation of the whole static site — headings AND body copy — on any
// deployment. Loaded once per language.
const dictLoaded = new Set<string>();
async function loadDict(lang: string) {
  if (dictLoaded.has(lang)) return;
  dictLoaded.add(lang);
  try {
    const res = await fetch(`/i18n/${lang}.json`, { cache: "force-cache" });
    if (res.ok) {
      const dict = await res.json();
      if (dict && typeof dict === "object") mergeCache(lang, dict);
    }
  } catch {
    dictLoaded.delete(lang); // let a later pass retry the fetch
  }
}

function setTranslating(active: boolean, lang: string) {
  try {
    window.dispatchEvent(new CustomEvent("vividpoly-translating", { detail: { active, lang } }));
  } catch {
    /* ignore */
  }
}

// Strings the provider confirmed it will not change (brand names, "BOPP", "PP")
// are remembered per language so we stop asking for them. Only ever populated
// from an explicit server answer — a failed request must never land here, or
// that copy would be stuck in English for the rest of the session.
const noTranslate = new Map<string, Set<string>>();
function getNoSet(lang: string): Set<string> {
  let s = noTranslate.get(lang);
  if (!s) {
    try {
      const raw = JSON.parse(localStorage.getItem(`vp-nt-${lang}`) || "[]");
      s = new Set(Array.isArray(raw) ? raw : []);
    } catch {
      s = new Set();
    }
    noTranslate.set(lang, s);
  }
  return s;
}
function persistNoSet(lang: string) {
  try {
    localStorage.setItem(`vp-nt-${lang}`, JSON.stringify(Array.from(getNoSet(lang))));
  } catch {
    /* non-fatal */
  }
}

// Apply every string we already know, from the given cache, to already-collected
// nodes. Returns the sources that still have no translation.
function applyKnown(items: Recorded[], cache: Record<string, string>): string[] {
  const unresolved = new Set<string>();
  for (const item of items) {
    const v = cache[item.source];
    if (v) item.apply(v);
    else unresolved.add(item.source);
  }
  return Array.from(unresolved);
}

async function translate(root: Node, lang: string) {
  const mine = generation;
  const items = collect(root);
  if (items.length === 0) return;

  const cache = getCache(lang);
  const noSet = getNoSet(lang);

  // 1) Repaint instantly from what's already in localStorage, before any await.
  let pending = applyKnown(items, cache);

  // 2) Fill in from the shipped dictionary (first switch to this language).
  if (pending.length > 0) {
    await loadDict(lang);
    if (generation !== mine) return;
    Object.assign(cache, getCache(lang));
    pending = applyKnown(items, cache);
  }

  // 3) Anything left is copy the dictionary doesn't cover — typically blog
  //    articles written in the admin after this build. Fetch in small batches
  //    and apply each batch as it lands.
  const missing = pending.filter((s) => !noSet.has(s));
  if (missing.length === 0) return;

  const batches: string[][] = [];
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    batches.push(missing.slice(i, i + BATCH_SIZE));
  }

  setTranslating(true, lang);
  try {
    let cursor = 0;
    const worker = async () => {
      while (cursor < batches.length) {
        const batch = batches[cursor++];
        const res = await requestTranslations(batch, lang);
        if (generation !== mine) return;
        if (!res) continue; // failed — leave English, retry on a later pass
        if (Object.keys(res.translations).length > 0) {
          mergeCache(lang, res.translations);
          Object.assign(cache, res.translations);
          applyKnown(items, cache);
        }
        if (res.untranslatable.length > 0) {
          for (const s of res.untranslatable) noSet.add(s);
          persistNoSet(lang);
        }
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, batches.length) }, worker)
    );
  } finally {
    setTranslating(false, lang);
  }
}

function applyDir(lang: string) {
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
}

// Public: switch the whole page to `lang`.
export async function applyLanguage(lang: string) {
  currentLang = lang;
  generation += 1; // stale passes for the previous language stop writing
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
      // Character-data changes are almost always our own writes; only new nodes
      // (route changes, blog bodies, dialogs) need another pass.
      if (m.addedNodes.length > 0) {
        scheduleRetranslate();
        return;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// The site always opens in English; a language only takes effect once the
// visitor picks one from the switcher (their choice is then remembered). We do
// NOT auto-translate from the browser's language, which was opening the site in
// random languages for people with multiple languages configured.
export function initialLanguage(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
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
