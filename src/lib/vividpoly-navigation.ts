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
  const base = typeof window !== 'undefined' ? window.location.pathname : '/';
  return `${base}${buildHash(state)}`;
}

function buildHash(state: VividPolyState): string {
  switch (state.screen) {
    case 'home':
      return '#';
    case 'catalogue':
      return `#catalogue/${state.cat}`;
    case 'pdp':
      return `#product/${state.pid}`;
    case 'sample':
      return `#sample/${state.samplePid}/${state.sampleStep}`;
    case 'quote':
      return '#quote';
    case 'about':
      return '#about';
    case 'contact':
      return '#contact';
    case 'blog':
      return '#blog';
    case 'faqs':
      return '#faqs';
    default:
      return '#';
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
export function scrollPageToTop(behavior: ScrollBehavior = 'auto') {
  if (typeof window === 'undefined') return;

  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.querySelector('.vp-root');
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
