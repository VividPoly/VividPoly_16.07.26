/**
 * Converts VividPoly.dc.html → Next.js source files.
 * Preserves inline CSS strings to avoid design drift.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcHtml = path.join(__dirname, '../../vividpoly-end-to-end-flow/project/VividPoly.dc.html');
const html = fs.readFileSync(srcHtml, 'utf8');
const lines = html.split('\n');

// --- Extract CSS (helmet style block) ---
const cssStart = lines.findIndex((l) => l.trim() === '<style>') + 1;
const cssEnd = lines.findIndex((l) => l.trim() === '</style>');
const css = lines.slice(cssStart, cssEnd).join('\n');

// --- Extract template (inside x-dc, skip helmet) ---
const templateStart = lines.findIndex((l) => l.includes('min-height:100vh;display:flex'));
const templateEnd = lines.findIndex((l) => l.trim() === '</div>') ; // first closing before </x-dc> - need last main wrapper
// Find line 902 `</div>` before `</x-dc>`
const xdcClose = lines.findIndex((l) => l.trim() === '</x-dc>');
let templateEndIdx = xdcClose - 1;
while (templateEndIdx > 0 && lines[templateEndIdx].trim() !== '</div>') templateEndIdx--;
const templateLines = lines.slice(templateStart, templateEndIdx + 1);

// --- Extract script body ---
const scriptStart = lines.findIndex((l) => l.includes('class Component extends DCLogic'));
const scriptEnd = lines.findIndex((l) => l.trim() === '}');
// find last `}` before `</script>`
const scriptClose = lines.findIndex((l) => l.trim() === '</script>');
let scriptEndIdx = scriptClose - 1;
while (scriptEndIdx > scriptStart && lines[scriptEndIdx].trim() !== '}') scriptEndIdx--;
const scriptBody = lines.slice(scriptStart, scriptEndIdx + 1).join('\n');

// --- Extract data section for separate file ---
const dataStart = scriptBody.indexOf('// ---------- DATA ----------');
const dataEnd = scriptBody.indexOf('// ---------- HELPERS ----------');
const dataSection = scriptBody.slice(dataStart, dataEnd);

function convertTemplate(tpl) {
  let s = tpl.join('\n');

  const trimRef = (x) => x.trim().replace(/\s+/g, '');
  const bindExpr = (expr) => {
    const e = expr.trim().replace(/\s+/g, '');
    if (/^[a-z]$/.test(e)) return e;
    if (/^[a-z]{1,3}\./.test(e)) return e;
    if (e.includes('.')) return `v.${e}`;
    return `v.${e}`;
  };

  // Remove HTML comments
  s = s.replace(/<!--[\s\S]*?-->/g, '');

  // class -> className
  s = s.replace(/\bclass="/g, 'className="');

  // sc-if / sc-for FIRST (before value= eats them)
  s = s.replace(/<sc-if value="\{\{\s*([^}]+)\s*\}\}"[^>]*>/g, (_, cond) => `{${bindExpr(cond)} && (<>`);
  s = s.replace(/<\/sc-if>/g, '</>)}');
  s = s.replace(/<sc-for list="\{\{\s*([^}]+)\s*\}\}" as="([^"]+)"[^>]*>/g, (_, list, as) => {
    const listExpr = list.trim().replace(/\s+/g, '');
    const isLoopList = /^[a-z]{1,3}\./.test(listExpr);
    const src = isLoopList ? listExpr : `v.${listExpr}`;
    return `{${src}.map((${as}, i_${as}) => (`;
  });
  s = s.replace(/<\/sc-for>/g, '))}');

  // Event handlers
  s = s.replace(/\bonClick="\{\{\s*([^}]+)\s*\}\}"/g, (_, fn) => `onClick={${bindExpr(fn)}}`);
  s = s.replace(/\bonMouseEnter="\{\{\s*([^}]+)\s*\}\}"/g, (_, fn) => `onMouseEnter={${bindExpr(fn)}}`);
  s = s.replace(/\bonMouseLeave="\{\{\s*([^}]+)\s*\}\}"/g, (_, fn) => `onMouseLeave={${bindExpr(fn)}}`);
  s = s.replace(/\bonFocus="\{\{\s*([^}]+)\s*\}\}"/g, (_, fn) => `onFocus={${bindExpr(fn)}}`);
  s = s.replace(/\bonChange="\{\{\s*([^}]+)\s*\}\}"/g, (_, fn) => `onChange={${bindExpr(fn)}}`);

  // ref
  s = s.replace(/\bref="\{\{\s*([^}]+)\s*\}\}"/g, (_, r) => `ref={v.${trimRef(r)}}`);

  // value (inputs only; sc-if already converted)
  s = s.replace(/\bvalue="\{\{\s*([^}]+)\s*\}\}"/g, (_, val) => `value={v.${trimRef(val)} ?? ""}`);

  // style-focus on search - remove attr
  s = s.replace(/\s*style-focus="[^"]*"/g, '');

  // style-hover -> data-vp-hover
  s = s.replace(/\s*style-hover="([^"]*)"/g, (_, h) => ` data-vp-hover="${h.replace(/"/g, '&quot;')}"`);

  // inline style strings -> React style objects BEFORE generic text binding
  const styleBlocks = [];
  s = s.replace(/\bstyle="([^"]*)"/g, (_, css) => {
    const entries = [];
    for (const part of css.split(';')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const colon = trimmed.indexOf(':');
      if (colon === -1) continue;
      const prop = trimmed.slice(0, colon).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const val = trimmed.slice(colon + 1).trim();
      const dyn = val.match(/\{\{\s*([\w.]+)\s*\}\}/);
      if (dyn) {
        const expr = dyn[1].trim().replace(/\s+/g, '');
        const isLoopField = /^[a-z]{1,3}\./.test(expr);
        entries.push(`${prop}: ${isLoopField ? expr : `v.${expr}`}`);
      } else {
        entries.push(`${prop}: ${JSON.stringify(val)}`);
      }
    }
    const block = `style={{ ${entries.join(', ')} }}`;
    const id = styleBlocks.length;
    styleBlocks.push(block);
    return `__VP_STYLE_${id}__`;
  });

  // Text bindings {{ x }} in remaining markup
  s = s.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, expr) => `{${bindExpr(expr)}}`);

  // Restore protected style blocks
  s = s.replace(/__VP_STYLE_(\d+)__/g, (_, id) => styleBlocks[parseInt(id, 10)]);

  return s;
}

const convertedTemplate = convertTemplate(templateLines);

// Write globals.css
const globalsPath = path.join(root, 'src/app/globals.css');
const existingGlobals = fs.existsSync(globalsPath) ? fs.readFileSync(globalsPath, 'utf8') : '';
const globals = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

::placeholder {
  color: #9a9a9a;
}

input,
select,
textarea,
button {
  font-family: inherit;
}

${css}

/* Hover styles from original design (style-hover) */
[data-vp-hover] {
  transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
}
`;

fs.writeFileSync(globalsPath, globals);

// Write style helper
fs.mkdirSync(path.join(root, 'src/lib'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'src/lib/vividpoly-style.ts'),
  `import type { CSSProperties } from 'react';

type VividPolyView = Record<string, unknown>;

function camelKey(key: string): string {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function st(v: VividPolyView, css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const part of css.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const prop = camelKey(trimmed.slice(0, colon).trim());
    let val = trimmed.slice(colon + 1).trim();
  if (val.includes('v.')) continue;
    out[prop] = val;
  }
  return out as CSSProperties;
}

export function bindHover(el: HTMLElement | null) {
  if (!el || el.dataset.vpHoverBound) return;
  el.dataset.vpHoverBound = '1';
  const hoverRaw = el.getAttribute('data-vp-hover');
  if (!hoverRaw) return;
  const hoverStyles: Record<string, string> = {};
  hoverRaw.split(';').forEach((part) => {
    const t = part.trim();
    if (!t) return;
    const c = t.indexOf(':');
    if (c === -1) return;
    hoverStyles[camelKey(t.slice(0, c).trim())] = t.slice(c + 1).trim();
  });
  const base: Record<string, string> = {};
  const enter = () => Object.assign(el.style, hoverStyles);
  const leave = () => {
    Object.keys(hoverStyles).forEach((k) => {
      const cssKey = k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      el.style.removeProperty(cssKey);
    });
  };
  el.addEventListener('mouseenter', enter);
  el.addEventListener('mouseleave', leave);
}

export function bindAllHovers(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll('[data-vp-hover]').forEach((el) => bindHover(el as HTMLElement));
}
`
);

// Write data file - transform class fields to exports
let dataTs = dataSection
  .replace('// ---------- DATA ----------\n', '')
  .replace(/^\s+/gm, '')
  .replace(/^(\w+)\s*=/gm, 'export const $1 =');

// Add types header
dataTs = `// @ts-nocheck\n/* Auto-generated from VividPoly.dc.html. Edit source design or re-run convert script */\n\n${dataTs}`;

fs.mkdirSync(path.join(root, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/data/vividpoly-data.ts'), dataTs);

// Write hook - port of class logic
const hookContent = `/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as D from '@/data/vividpoly-data';

export type Screen =
  | 'home' | 'catalogue' | 'pdp' | 'sizing' | 'faqs' | 'addons'
  | 'blog' | 'about' | 'contact' | 'quote';

export interface VividPolyState {
  screen: Screen;
  menu: 'products' | 'resources' | null;
  prodTab: 'type' | 'use';
  aboutTab: 'about' | 'why';
  pid: string;
  cap: number;
  gallery: number;
  openFaq: number | null;
  activeUse: number | null;
  usePinned: boolean;
  activeBuyer: number;
  buyerPinned: boolean;
  searchOpen: boolean;
  searchVal: string;
  chatOpen: boolean;
  chatStep: number;
  quoteStep: number;
  quote: Record<string, any>;
  cat: 'type' | 'use';
  filters: Record<string, Record<string, boolean>>;
}

const initialState: VividPolyState = {
  screen: 'home', menu: null, prodTab: 'type', aboutTab: 'about',
  pid: 'open-mouth', cap: 25, gallery: 0, openFaq: null,
  activeUse: null, usePinned: false,
  activeBuyer: 0, buyerPinned: false,
  searchOpen: false, searchVal: '', chatOpen: false, chatStep: 0,
  quoteStep: 0, quote: {}, cat: 'type', filters: {},
};

function prod(id: string) {
  return D.products.find((p) => p.id === id);
}

export function useVividPoly() {
  const [s, setState] = useState<VividPolyState>(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const go = useCallback((screen: Screen) => {
    setState((st) => ({ ...st, screen, menu: null, searchOpen: false }));
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  const toggleMenu = useCallback((m: 'products' | 'resources') => {
    setState((st) => ({ ...st, menu: st.menu === m ? null : m, searchOpen: false }));
  }, []);

  useEffect(() => {
    const tick = () => {
      const el = scrollRef.current;
      if (el && !pausedRef.current && s.screen === 'home') {
        el.scrollLeft += 0.6;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [s.screen]);

  const prodScrollBy = useCallback((dx: number) => {
    scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  }, []);

  const v = useMemo(() => {
    const accent = '#3538CD';
    const mkProd = (p: (typeof D.products)[0]) => ({
      ...p,
      open: () => {
        setState((st) => ({ ...st, screen: 'pdp', pid: p.id, gallery: 0, menu: null }));
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      },
    });
    const products = D.products.map(mkProd);

    const q = (s.searchVal || '').toLowerCase();
    let searchResults: any[];
    let searchHeading: string;
    const allItems = [
      ...D.products.map((p) => ({
        label: p.name, icon: '▦', kind: 'product',
        go: () => setState((st) => ({ ...st, screen: 'pdp', pid: p.id, searchOpen: false, searchVal: '' })),
      })),
      ...D.useGroups.flatMap((g) => g.items).map((u) => ({
        label: u, icon: '◈', kind: 'industry',
        go: () => setState((st) => ({ ...st, screen: 'catalogue', cat: 'use', searchOpen: false, searchVal: '' })),
      })),
      ...D.blogList.map((b) => ({
        label: b[0], icon: '❡', kind: 'article',
        go: () => setState((st) => ({ ...st, screen: 'blog', searchOpen: false, searchVal: '' })),
      })),
    ];
    if (!q) {
      searchHeading = 'Recent searches';
      searchResults = ['rice bags', 'cement bags', 'printed laminated', '25 kg open mouth'].map((t) => ({
        label: t, icon: '↺', kind: 'recent', open: () => setState((st) => ({ ...st, searchVal: t })),
      }));
    } else {
      searchHeading = 'Suggestions';
      searchResults = allItems.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 7).map((i) => ({ ...i, open: i.go }));
      if (!searchResults.length) {
        searchResults = [{ label: 'No matches. Try "rice" or "cement"', icon: '⌕', kind: '', open: () => {} }];
      }
    }

    const megaIsType = s.prodTab === 'type';
    const megaGroups = megaIsType
      ? D.typeGroups.map((g) => ({
          title: g.title,
          items: g.ids.map((id) => {
            const p = prod(id)!;
            return { label: p.name, open: mkProd(p).open };
          }),
        }))
      : D.useGroups.map((g) => ({
          title: g.title,
          items: g.items.map((u) => ({
            label: u,
            open: () => setState((st) => ({ ...st, screen: 'catalogue', cat: 'use', menu: null })),
          })),
        }));

    const chatLog: { text: string; align: string; bg: string; color: string }[] = [];
    for (let i = 0; i <= s.chatStep && i < D.chatScript.length; i++) {
      chatLog.push({ text: D.chatScript[i], align: 'flex-start', bg: '#fff', color: '#1A1A1A' });
    }
    const chatChips = (D.chatChoices[s.chatStep] || []).map((label) => ({
      label,
      pick: () => {
        if (label.startsWith('Share details')) {
          setState((st) => ({ ...st, screen: 'quote', quoteStep: 0, chatOpen: false }));
          return;
        }
        setState((st) => ({ ...st, chatStep: Math.min(st.chatStep + 1, D.chatScript.length - 1) }));
      },
    }));

    const footLink = (label: string, fn: () => void) => ({ label, open: fn });

    const catUse = s.cat === 'use';
    const filterSecs = D.filterSections.map(([title, opts]) => ({
      title,
      opts: opts.map((o) => ({
        label: o,
        checked: !!(s.filters[title] || {})[o],
        dot: (s.filters[title] || {})[o] ? '#3538CD' : '#fff',
        bd: (s.filters[title] || {})[o] ? '#3538CD' : '#C0C0C0',
        toggle: () =>
          setState((st) => {
            const sec = { ...(st.filters[title] || {}) };
            sec[o] = !sec[o];
            return { filters: { ...st.filters, [title]: sec } };
          }),
      })),
    }));
    const activeFilterCount = Object.values(s.filters).reduce(
      (n, sec) => n + Object.values(sec || {}).filter(Boolean).length,
      0,
    );

    const sp = prod(s.pid) || D.products[0];
    const pdpFeatures = sp.features.map((f) => ({ f: f[0], d: f[1] }));
    const pdpSpec = sp.spec.map((r) => ({ p: r[0], o: r[1] }));
    const galleryThumbs = [0, 1, 2, 3].map((i) => ({
      i, sel: () => setState((st) => ({ ...st, gallery: i })), bd: s.gallery === i ? accent : '#E0E0E0',
    }));
    const trustBadges = ['Customizable Specification', 'Sample Available Before Bulk Order', 'Export Packing Included', 'Responsive Export Team'].map((t) => ({ t }));
    const relatedProducts = D.products.filter((p) => p.id !== sp.id).slice(0, 4).map(mkProd);

    const capStops = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];
    const sizeRow = D.sizing.find((r) => parseInt(r[0]) === s.cap) || D.sizing[4];
    const sizeIdx = Math.max(0, capStops.indexOf(s.cap));
    const sizePct = (sizeIdx / (capStops.length - 1)) * 100;

    const faqs = D.faqList.map((f, i) => ({
      q: f[0], a: f[1], open: s.openFaq === i,
      sign: s.openFaq === i ? '–' : '+',
      toggle: () => setState((st) => ({ openFaq: st.openFaq === i ? null : i })),
    }));

    const setBuyer = (i: number) =>
      setState((st) => ({
        ...st,
        activeBuyer: ((i % D.buyerRows.length) + D.buyerRows.length) % D.buyerRows.length,
      }));

    const buyerCards = D.buyerRows.map((r, i) => {
      const m = D.buyerMeta[i];
      const active = s.activeBuyer === i;
      return {
        num: m.num, label: m.label, short: m.short,
        cardBg: active ? '#F0F1FF' : '#fff',
        cardBd: active ? '#3538CD' : '#E0E0E0',
        cardShadow: active ? '0 8px 20px rgba(53,56,205,.1)' : 'none',
        iconBg: active ? '#EEF0FF' : '#F5F5F5',
        iconCol: active ? '#3538CD' : '#6B6B6B',
        titleCol: active ? '#3538CD' : '#1A1A1A',
        subCol: '#6B6B6B',
        preview: () => { if (!s.buyerPinned) setBuyer(i); },
        select: () => setState((st) => ({
          activeBuyer: i,
          buyerPinned: !(st.activeBuyer === i && st.buyerPinned),
        })),
      };
    });

    const b = D.buyerRows[s.activeBuyer] || D.buyerRows[0];
    const bm = D.buyerMeta[s.activeBuyer] || D.buyerMeta[0];
    const buyerDetailTags = (b[2] || []).map((label) => ({ label }));

    const useRows = D.useRows.map((r, i) => {
      const active = s.activeUse === i;
      return {
        use: r[0], bags: r[1], active,
        rowBg: active ? '#F0F1FF' : 'transparent',
        rowColor: active ? '#3538CD' : '#1A1A1A',
        rowAccent: active ? '#3538CD' : '#D8D8D8',
        arrowOpacity: active ? '1' : '0.35',
        preview: () => { if (!s.usePinned) setState((st) => ({ ...st, activeUse: i })); },
        select: () => setState((st) => ({
          activeUse: i,
          usePinned: !(st.activeUse === i && st.usePinned),
        })),
      };
    });

    const useDetailVisible = s.activeUse !== null && s.activeUse >= 0;
    const addonRows = D.addons.map((a) => ({ name: a[0], desc: a[1] }));
    const blogRows = D.blogList.map((b) => ({ title: b[0], purpose: b[1], open: () => go('blog') }));

    const companyRows = [['Company / Brand', 'VIVIDPOLY'], ['Website', 'WWW.VIVIDPOLY.COM'], ['Email', 'INFO@VIVIDPOLY.COM'], ['Phone', '+91 92136 26740'], ['Corporate Address', 'Sankalp Square, A 1601, Sindhu Bhavan Marg, near Taj Hotel, opp. Shoot Game, PRL Colony, Bopal, Ahmedabad, Gujarat 380058'], ['Factory Address', 'Vivid Poly, Sherpura Gam, Halol Savli Road, Savli, Vadodara']].map((r) => ({ k: r[0], v: r[1] }));
    const whyRows = [['India-based exporter positioning', 'Buyers can source PP bags from India for USA, Canada, Australia, Europe, UK, Africa, Thailand, Saudi Arabia, and other markets.'], ['Focused PP Bags product range', 'The product offering is clear and practical, covering common industrial, agricultural, retail, and promotional bag types.'], ['5 kg to 75 kg capacity planning', 'Buyers can discuss small retail packs, mid-size commodity bags, and heavy-duty industrial bags.'], ['Custom construction options', 'Layers, lamination, gusset, liner, perforation, window, handle, valve, pinch bottom, and block bottom options can be planned.'], ['Printing and branding support', 'Flexo printing and printed laminated woven PP options help support brand visibility and market presentation.'], ['Product-use guidance', 'Buyers can select bags by application, such as rice, fertilizer, animal feed, chemicals, cement, salt, sugar, retail, and shopping.'], ['Buyer-friendly quote process', 'The website collects capacity, size, packed product, quantity, destination country, printing, packing, and technical needs before quotation.']].map((r) => ({ k: r[0], v: r[1] }));
    const contactRows = [['Website', 'WWW.VIVIDPOLY.COM'], ['Email', 'INFO@VIVIDPOLY.COM'], ['Phone', '+91 92136 26740'], ['Corporate Address', 'Sankalp Square, A 1601, Sindhu Bhavan Marg, near Taj Hotel, opp. Shoot Game, PRL Colony, Bopal, Ahmedabad, Gujarat 380058'], ['Factory Address', 'Vivid Poly, Sherpura Gam, Halol Savli Road, Savli, Vadodara']].map((r) => ({ k: r[0], v: r[1] }));

    const setQ = (k: string, val: unknown) =>
      setState((st) => ({ ...st, quote: { ...st.quote, [k]: val } }));
    const qv = s.quote;
    const quoteNav = ['Product', 'Contact', 'Capacity', 'Specs', 'Review'].map((label, i) => ({
      label, n: i + 1, active: s.quoteStep === i, done: s.quoteStep > i,
      numBg: s.quoteStep > i ? '#3538CD' : s.quoteStep === i ? '#3538CD' : '#fff',
      numColor: s.quoteStep >= i ? '#fff' : '#9A9A9A',
      numBd: s.quoteStep >= i ? '#3538CD' : '#C0C0C0',
      lblColor: s.quoteStep >= i ? '#1A1A1A' : '#9A9A9A',
    }));

    return {
      accent,
      goHome: () => go('home'),
      goContact: () => go('contact'),
      goQuote: () => go('quote'),
      goAbout: () => go('about'),
      goBlog: () => go('blog'),
      goCatalogueType: () => setState((st) => ({ ...st, screen: 'catalogue', cat: 'type', menu: null })),
      goCatalogueUse: () => setState((st) => ({ ...st, screen: 'catalogue', cat: 'use', menu: null })),
      toggleProducts: () => toggleMenu('products'),
      toggleResources: () => toggleMenu('resources'),
      closeAll: () => setState((st) => ({ ...st, menu: null, searchOpen: false })),
      menuProducts: s.menu === 'products',
      menuResources: s.menu === 'resources',
      overlayOpen: !!s.menu || s.searchOpen,
      navHomeColor: s.screen === 'home' ? '#3538CD' : '#1A1A1A',
      navProductsColor: s.screen === 'catalogue' || s.screen === 'pdp' || s.menu === 'products' ? '#3538CD' : '#1A1A1A',
      navAboutColor: s.screen === 'about' ? '#3538CD' : '#1A1A1A',
      navBlogColor: s.screen === 'blog' ? '#3538CD' : '#1A1A1A',
      navResourcesColor: s.screen === 'addons' || s.screen === 'sizing' || s.menu === 'resources' ? '#3538CD' : '#1A1A1A',
      navContactColor: s.screen === 'contact' ? '#3538CD' : '#1A1A1A',
      prodScrollRef: scrollRef,
      prodHoverOn: () => { pausedRef.current = true; },
      prodHoverOff: () => { pausedRef.current = false; },
      prodPrev: () => prodScrollBy(-340),
      prodNext: () => prodScrollBy(340),
      setTabType: () => setState((st) => ({ ...st, prodTab: 'type' })),
      setTabUse: () => setState((st) => ({ ...st, prodTab: 'use' })),
      megaGroups,
      megaCols: megaIsType ? 3 : 4,
      tabTypeColor: megaIsType ? accent : '#6B6B6B',
      tabTypeBorder: megaIsType ? accent : 'transparent',
      tabUseColor: !megaIsType ? accent : '#6B6B6B',
      tabUseBorder: !megaIsType ? accent : 'transparent',
      resourceLinks: [
        { title: 'Add-On Features', desc: 'Layers, printing, gusset, liners, handles, packing.', open: () => go('addons') },
        { title: 'Sizing & Capacity Tool', desc: 'Interactive 5 kg – 75 kg capacity selector.', open: () => go('sizing') },
      ],
      searchVal: s.searchVal,
      searchOpen: s.searchOpen,
      searchResults,
      searchHeading,
      onSearchFocus: () => setState((st) => ({ ...st, searchOpen: true })),
      onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((st) => ({ ...st, searchVal: e.target.value, searchOpen: true })),
      markets: D.markets,
      products,
      buyerCards,
      buyerDetailReq: b[0],
      buyerDetailRes: b[1],
      buyerDetailTags,
      buyerDetailHasTags: buyerDetailTags.length > 0,
      buyerDetailNum: bm.num,
      buyerDots: D.buyerRows.map((_, i) => ({
        pick: () => setBuyer(i),
        bg: s.activeBuyer === i ? '#3538CD' : '#D0D0D0',
      })),
      buyerPrev: () => setBuyer(s.activeBuyer - 1),
      buyerNext: () => setBuyer(s.activeBuyer + 1),
      useRows,
      useDetailVisible: s.activeUse !== null && s.activeUse >= 0,
      useDetailHidden: !(s.activeUse !== null && s.activeUse >= 0),
      useDetailTitle: s.activeUse !== null && s.activeUse >= 0 ? D.useRows[s.activeUse][0] : '',
      useDetailBags: s.activeUse !== null && s.activeUse >= 0 ? D.useRows[s.activeUse][1] : '',
      clearUsePreview: () => { if (!s.usePinned) setState((st) => ({ ...st, activeUse: null })); },
      showHome: s.screen === 'home',
      showCatalogue: s.screen === 'catalogue',
      catTitle: catUse ? 'Shop by Industry / Use' : 'Shop by Product Type',
      catCrumb: catUse ? 'Products / By Industry & Use' : 'Products / By Product Type',
      catSub: catUse ? 'Select the right bag by what you are packing: agriculture, agri-inputs, industrial, retail.' : 'Ten woven PP bag constructions, customizable from 5 kg to 75 kg and export-ready.',
      catCount: D.products.length,
      filterSecs,
      activeFilterCount,
      clearFilters: () => setState((st) => ({ ...st, filters: {} })),
      showPdp: s.screen === 'pdp',
      product: sp,
      pdpFeatures,
      pdpSpec,
      galleryThumbs,
      trustBadges,
      relatedProducts,
      pdpQuoteLabel: 'Get a Quote for ' + sp.name,
      pdpGetQuote: () => {
        setState((st) => ({ ...st, screen: 'quote', quoteStep: 0, quote: { ...st.quote, product: sp.name } }));
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      },
      backToCatalogue: () => setState((st) => ({ ...st, screen: 'catalogue' })),
      showSizing: s.screen === 'sizing',
      capStops: capStops.map((c) => ({
        c, label: c + ' kg', active: s.cap === c, col: s.cap === c ? '#3538CD' : '#9A9A9A',
        pick: () => setState((st) => ({ ...st, cap: c })),
      })),
      capValue: s.cap,
      capLabel: s.cap + ' kg',
      sizePct,
      sizeUses: sizeRow[1],
      sizeBags: sizeRow[2],
      sizeFocus: sizeRow[3],
      onCapSlider: (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = parseInt(e.target.value);
        setState((st) => ({ ...st, cap: capStops[idx] }));
      },
      capSliderIdx: sizeIdx,
      sampleAtCap: () => {
        setState((st) => ({ ...st, screen: 'quote', quoteStep: 0, quote: { ...st.quote, capacity: st.cap + ' kg' } }));
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      },
      showFaqs: s.screen === 'faqs',
      faqs,
      showAddons: s.screen === 'addons',
      addonRows,
      showBlog: s.screen === 'blog',
      blogRows,
      showAbout: s.screen === 'about',
      aboutIsAbout: s.aboutTab === 'about',
      aboutIsWhy: s.aboutTab === 'why',
      setAboutAbout: () => setState((st) => ({ ...st, aboutTab: 'about' })),
      setAboutWhy: () => setState((st) => ({ ...st, aboutTab: 'why' })),
      aboutTabBg: s.aboutTab === 'about' ? '#3538CD' : '#fff',
      aboutTabCol: s.aboutTab === 'about' ? '#fff' : '#3A3A3A',
      aboutTabBd: s.aboutTab === 'about' ? '#3538CD' : '#E0E0E0',
      whyTabBg: s.aboutTab === 'why' ? '#3538CD' : '#fff',
      whyTabCol: s.aboutTab === 'why' ? '#fff' : '#3A3A3A',
      whyTabBd: s.aboutTab === 'why' ? '#3538CD' : '#E0E0E0',
      companyRows,
      whyRows,
      showContact: s.screen === 'contact',
      contactRows,
      showQuote: s.screen === 'quote',
      quoteStepNum: s.quoteStep,
      quoteNav,
      quoteProductChips: D.products.map((p) => ({
        label: p.name, sel: qv.product === p.name,
        bg: qv.product === p.name ? '#EEF0FF' : '#fff',
        bd: qv.product === p.name ? '#3538CD' : '#E0E0E0',
        col: qv.product === p.name ? '#3538CD' : '#3A3A3A',
        pick: () => setQ('product', p.name),
      })),
      capChips: ['5 kg', '10 kg', '15 kg', '20 kg', '25 kg', '30 kg', '40 kg', '50 kg', '60 kg', '75 kg', 'Custom'].map((c) => ({
        label: c, bg: qv.capacity === c ? '#EEF0FF' : '#fff', bd: qv.capacity === c ? '#3538CD' : '#E0E0E0',
        col: qv.capacity === c ? '#3538CD' : '#3A3A3A', pick: () => setQ('capacity', c),
      })),
      printChips: ['Plain', 'Flexo printed', 'Printed laminated', 'Multi-color'].map((c) => ({
        label: c, bg: qv.printing === c ? '#EEF0FF' : '#fff', bd: qv.printing === c ? '#3538CD' : '#E0E0E0',
        col: qv.printing === c ? '#3538CD' : '#3A3A3A', pick: () => setQ('printing', c),
      })),
      addonChips: ['Liner', 'Gusset', 'Handle', 'Window', 'Perforation', 'Valve', 'Pinch', 'Block bottom'].map((c) => ({
        label: c, on: !!(qv.addons || {})[c],
        bg: (qv.addons || {})[c] ? '#EEF0FF' : '#fff',
        bd: (qv.addons || {})[c] ? '#3538CD' : '#E0E0E0',
        col: (qv.addons || {})[c] ? '#3538CD' : '#3A3A3A',
        pick: () => setQ('addons', { ...(qv.addons || {}), [c]: !(qv.addons || {})[c] }),
      })),
      reviewRows: [['Product type', qv.product || '-'], ['Packed product', qv.packed || '-'], ['Capacity', qv.capacity || '-'], ['Bag size', qv.size || '-'], ['Printing', qv.printing || '-'], ['Add-ons', Object.keys(qv.addons || {}).filter((k) => (qv.addons || {})[k]).join(', ') || '-'], ['Packing', qv.packing || '-'], ['Quantity', qv.quantity || '-'], ['Destination', qv.country || '-']].map((r) => ({ k: r[0], v: r[1] })),
      qStep0: s.quoteStep === 0,
      qStep1: s.quoteStep === 1,
      qStep2: s.quoteStep === 2,
      qStep3: s.quoteStep === 3,
      qStep4: s.quoteStep === 4,
      qStep5: s.quoteStep === 5,
      quoteForm: s.quoteStep < 5,
      quoteNext: () => setState((st) => ({ ...st, quoteStep: Math.min(st.quoteStep + 1, 5) })),
      quoteBack: () => setState((st) => ({ ...st, quoteStep: Math.max(st.quoteStep - 1, 0) })),
      quoteShowNext: s.quoteStep < 4,
      quoteSubmit: () => {
        setState((st) => ({ ...st, quoteStep: 5 }));
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      },
      quoteRestart: () => setState((st) => ({ ...st, screen: 'home', quoteStep: 0, quote: {} })),
      qSet: {
        name: (e: React.ChangeEvent<HTMLInputElement>) => setQ('name', e.target.value),
        company: (e: React.ChangeEvent<HTMLInputElement>) => setQ('company', e.target.value),
        email: (e: React.ChangeEvent<HTMLInputElement>) => setQ('email', e.target.value),
        whatsapp: (e: React.ChangeEvent<HTMLInputElement>) => setQ('whatsapp', e.target.value),
        country: (e: React.ChangeEvent<HTMLInputElement>) => setQ('country', e.target.value),
        port: (e: React.ChangeEvent<HTMLInputElement>) => setQ('port', e.target.value),
        packed: (e: React.ChangeEvent<HTMLInputElement>) => setQ('packed', e.target.value),
        size: (e: React.ChangeEvent<HTMLInputElement>) => setQ('size', e.target.value),
        quantity: (e: React.ChangeEvent<HTMLInputElement>) => setQ('quantity', e.target.value),
        packing: (e: React.ChangeEvent<HTMLInputElement>) => setQ('packing', e.target.value),
        message: (e: React.ChangeEvent<HTMLTextAreaElement>) => setQ('message', e.target.value),
      },
      qv,
      footCompany: [footLink('Home', () => go('home')), footLink('About VividPoly', () => setState((st) => ({ ...st, screen: 'about', aboutTab: 'about' }))), footLink('Why Choose VividPoly', () => setState((st) => ({ ...st, screen: 'about', aboutTab: 'why' }))), footLink('Contact Us', () => go('contact'))],
      footHelp: [footLink('Product Uses', () => setState((st) => ({ ...st, screen: 'catalogue', cat: 'use' }))), footLink('Add-On Features', () => go('addons')), footLink('Sizing & Capacity Tool', () => go('sizing')), footLink('Blog', () => go('blog')), footLink('FAQs', () => go('home')), footLink('Get Quote', () => go('quote'))],
      chatOpen: s.chatOpen,
      chatLog,
      chatChips,
      chatIcon: s.chatOpen ? '×' : '💬',
      openChat: () => setState((st) => ({ ...st, chatOpen: true })),
      closeChat: () => setState((st) => ({ ...st, chatOpen: false })),
      toggleChat: () => setState((st) => ({ ...st, chatOpen: !st.chatOpen })),
    };
  }, [s, go, toggleMenu, prodScrollBy]);

  return v;
}
`;

fs.mkdirSync(path.join(root, 'src/hooks'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/hooks/useVividPoly.ts'), hookContent);

// Write VividPolyView
const viewContent = `'use client';

import { useEffect, useRef } from 'react';
import { useVividPoly } from '@/hooks/useVividPoly';
import { bindAllHovers } from '@/lib/vividpoly-style';

export default function VividPolyView() {
  const v = useVividPoly() as Record<string, any>;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bindAllHovers(rootRef.current);
  }, [v]);

  return (
    <div ref={rootRef}>
${convertedTemplate.split('\n').map((l) => '      ' + l).join('\n')}
    </div>
  );
}
`;

fs.mkdirSync(path.join(root, 'src/components/vividpoly'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/components/vividpoly/VividPolyView.tsx'), viewContent);

// Update page.tsx
fs.writeFileSync(
  path.join(root, 'src/app/page.tsx'),
  `import VividPolyView from '@/components/vividpoly/VividPolyView';

export default function Home() {
  return <VividPolyView />;
}
`,
);

// Update layout.tsx metadata
const layoutPath = path.join(root, 'src/app/layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');
layout = layout.replace(/title: ".*"/, 'title: "VIVIDPOLY: PP Bags Exporter from India"');
layout = layout.replace(/description: ".*"/, 'description: "VIVIDPOLY exports PP bags from India for global buyers."');
fs.writeFileSync(layoutPath, layout);

console.log('Conversion complete.');
console.log('  globals.css updated');
console.log('  src/data/vividpoly-data.ts');
console.log('  src/hooks/useVividPoly.ts');
console.log('  src/components/vividpoly/VividPolyView.tsx');
