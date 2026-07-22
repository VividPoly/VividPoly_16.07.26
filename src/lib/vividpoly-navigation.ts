import type { VividPolyState } from '@/hooks/useVividPoly';

const NAV_KEY = 'vp';

export type NavHistoryPayload = { [NAV_KEY]: VividPolyState };

export type VpBreadcrumb = { label: string; onClick?: () => void };

export function cloneNavState(state: VividPolyState): VividPolyState {
  return structuredClone(state);
}

export function readNavState(data: unknown): VividPolyState | null {
  if (!data || typeof data !== 'object') return null;
  const snapshot = (data as NavHistoryPayload)[NAV_KEY];
  return snapshot ?? null;
}

export function navPayload(state: VividPolyState): NavHistoryPayload {
  return { [NAV_KEY]: cloneNavState(state) };
}

export function navUrl(state: VividPolyState): string {
  return buildPath(state);
}

/** Reconstruct the screen state from the URL pathname so a refresh keeps the
    current page instead of resetting to home. Returns null for the root path so
    callers fall back to the default initial state. */
export function parsePath(pathname: string): Partial<VividPolyState> | null {
  if (typeof pathname !== 'string') return null;
  const raw = pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim();
  if (!raw) return null;

  const parts = raw.split('/').filter(Boolean);
  const head = parts[0];

  switch (head) {
    case 'catalogue':
      return { screen: 'catalogue', cat: parts[1] === 'use' ? 'use' : 'type' };
    case 'product': {
      const out: Partial<VividPolyState> = { screen: 'pdp' };
      if (parts[1]) out.pid = parts[1];
      return out;
    }
    case 'sample': {
      const out: Partial<VividPolyState> = { screen: 'sample' };
      if (parts[1]) out.samplePid = parts[1];
      const step = Number.parseInt(parts[2] ?? '', 10);
      if (Number.isFinite(step)) out.sampleStep = step;
      return out;
    }
    case 'quote':
      return { screen: 'quote' };
    case 'about':
      return { screen: 'about' };
    case 'careers':
      return { screen: 'careers' };
    case 'contact':
      return { screen: 'contact' };
    case 'blog':
      return { screen: 'blog' };
    case 'faqs':
      return { screen: 'home' };
    default:
      return null;
  }
}

function buildPath(state: VividPolyState): string {
  switch (state.screen) {
    case 'home':
      return '/';
    case 'catalogue':
      return `/catalogue/${state.cat}`;
    case 'pdp':
      return `/product/${state.pid}`;
    case 'sample':
      return `/sample/${state.samplePid}/${state.sampleStep}`;
    case 'quote':
      return '/quote';
    case 'about':
      return '/about';
    case 'careers':
      return '/careers';
    case 'contact':
      return '/contact';
    case 'blog':
      return '/blog';
    default:
      return '/';
  }
}

/** True when the change should add a browser history entry. */
export function isNavTransition(prev: VividPolyState, next: VividPolyState): boolean {
  if (prev.screen !== next.screen) return true;
  if (next.screen === 'pdp' && prev.pid !== next.pid) return true;
  if (next.screen === 'catalogue' && prev.cat !== next.cat) return true;
  if (next.screen === 'sample' && prev.sampleStep !== next.sampleStep) return true;
  if (next.screen === 'quote' && prev.quoteStep !== next.quoteStep) return true;
  return false;
}

export function splitBreadcrumbTrail(trail: string, onParentBack?: () => void): VpBreadcrumb[] {
  const parts = trail.split('/').map((part) => part.trim()).filter(Boolean);
  return parts.map((label, index) => ({
    label,
    onClick: onParentBack && index < parts.length - 1 ? onParentBack : undefined,
  }));
}

/** Ensure every breadcrumb trail starts with a clickable Home link. */
export function withHomeBreadcrumb(
  items: VpBreadcrumb[],
  goHome: () => void,
  homeLabel = 'Home',
): VpBreadcrumb[] {
  if (items.length > 0 && items[0].label === homeLabel) return items;
  return [{ label: homeLabel, onClick: goHome }, ...items];
}

/** Scroll window and any scrollable ancestors back to the top. */
let skipNextScrollToTop = false;

export function requestSkipNextScrollToTop() {
  skipNextScrollToTop = true;
}

export function consumeSkipNextScrollToTop() {
  const shouldSkip = skipNextScrollToTop;
  skipNextScrollToTop = false;
  return shouldSkip;
}

/** One-shot list scroll restore after leaving a PDP (not a general history map). */
type ArmedListScroll = { key: string; productId: string; y: number };
let armedListScroll: ArmedListScroll | null = null;

function readWindowScrollY(): number {
  if (typeof window === 'undefined') return 0;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function writeWindowScrollY(y: number) {
  if (typeof window === 'undefined') return;
  const top = Math.max(0, y);
  window.scrollTo({ top, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

/** Key used by page transitions for catalogue / home list screens. */
export function scrollRestoreKeyForState(
  state: Pick<VividPolyState, 'screen' | 'cat'>,
): string | null {
  if (state.screen === 'catalogue') return `catalogue:${state.cat}`;
  if (state.screen === 'home') return 'home';
  return null;
}

/** Arm restore once when leaving a list screen for a product detail. */
export function armListScrollRestore(key: string, productId: string) {
  if (typeof window === 'undefined' || !key) return;
  armedListScroll = {
    key,
    productId,
    y: Math.max(0, Math.round(readWindowScrollY())),
  };
}

export function clearListScrollRestore() {
  armedListScroll = null;
}

export function hasArmedListScrollRestore(key: string): boolean {
  return Boolean(armedListScroll && armedListScroll.key === key);
}

export type ConsumedListScrollRestore = { y: number; productId: string };

/** Returns restore data and clears the arm only when the key matches. */
export function consumeArmedListScrollRestore(key: string): ConsumedListScrollRestore | null {
  if (!armedListScroll || armedListScroll.key !== key) return null;
  const { y, productId } = armedListScroll;
  armedListScroll = null;
  return { y, productId };
}

/** Scroll the opened product card into view, falling back to the saved Y. */
export function applyListScrollRestore(data: ConsumedListScrollRestore) {
  if (typeof window === 'undefined') return;

  const apply = () => {
    if (data.productId) {
      const el = document.querySelector<HTMLElement>(
        `[data-vp-product-id="${data.productId}"]`,
      );
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
        return;
      }
    }
    writeWindowScrollY(data.y);
  };

  apply();
  requestAnimationFrame(apply);
}

let pendingHomeFaqScroll: ScrollBehavior | null = null;

/** Arm a deferred scroll to the home FAQ section after the next route transition. */
export function armHomeFaqScroll(behavior: ScrollBehavior = 'smooth') {
  pendingHomeFaqScroll = behavior;
}

export function peekHomeFaqScroll(): ScrollBehavior | null {
  return pendingHomeFaqScroll;
}

export function clearHomeFaqScroll() {
  pendingHomeFaqScroll = null;
}

export function scrollPageToTop(behavior: ScrollBehavior = 'auto') {
  if (typeof window === 'undefined') return;

  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.querySelector('.vp-root');
  if (root instanceof HTMLElement) {
    const resetScrollable = (node: HTMLElement) => {
      const { overflowY } = getComputedStyle(node);
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
        node.scrollTop = 0;
      }
    };

    resetScrollable(root);
    root.querySelectorAll<HTMLElement>('*').forEach(resetScrollable);
  }

  let el = root?.parentElement ?? null;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      el.scrollTop = 0;
    }
    el = el.parentElement;
  }
}

export function enableManualScrollRestoration() {
  if (typeof window === 'undefined') return;
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

/** Scroll within a horizontal track only. Does not move the page vertically. */
export function scrollChildIntoHorizontalView(
  container: HTMLElement,
  child: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
) {
  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const childCenter = childRect.left + childRect.width / 2;
  const containerCenter = containerRect.left + containerRect.width / 2;
  container.scrollTo({
    left: container.scrollLeft + (childCenter - containerCenter),
    behavior,
  });
}

/** Align a horizontal track child to the leading (left) edge of the container. */
export function scrollChildToStartOfHorizontalView(
  container: HTMLElement,
  child: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
) {
  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  container.scrollTo({
    left: container.scrollLeft + (childRect.left - containerRect.left),
    behavior,
  });
}

/** Instantly center a horizontal track child (no animated scroll; used for loop jumps). */
export function jumpChildIntoHorizontalView(container: HTMLElement, child: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const childCenter = childRect.left + childRect.width / 2;
  const containerCenter = containerRect.left + containerRect.width / 2;
  container.scrollLeft = container.scrollLeft + (childCenter - containerCenter);
}

function getHeaderScrollOffset(extra = 16) {
  if (typeof window === 'undefined') return extra;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--vp-header-offset').trim();
  const headerOffset = Number.parseFloat(raw) || 100;
  return headerOffset + extra;
}

/** Scroll so an in-page anchor sits just below the fixed site header. */
export function scrollToAnchorWithHeaderOffset(
  id: string,
  behavior: ScrollBehavior = 'smooth',
  extraOffset = 16,
) {
  if (typeof window === 'undefined') return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - getHeaderScrollOffset(extraOffset);
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export const HOME_FAQ_SECTION_ID = 'vp-home-faq';

/** Retry scroll until the home FAQ section is mounted (after route transitions). */
export function scrollToHomeFaqWhenReady(
  behavior: ScrollBehavior = 'smooth',
  extraOffset = 12,
  maxAttempts = 30,
  intervalMs = 50,
) {
  if (typeof window === 'undefined') return;

  let attempts = 0;
  const tryScroll = () => {
    if (scrollToAnchorWithHeaderOffset(HOME_FAQ_SECTION_ID, behavior, extraOffset)) return;
    attempts += 1;
    if (attempts >= maxAttempts) return;
    window.setTimeout(tryScroll, intervalMs);
  };

  tryScroll();
}
