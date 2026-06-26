import type { CSSProperties } from 'react';

type VividPolyView = Record<string, unknown>;

function camelKey(key: string): string {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function toCssKey(prop: string): string {
  return prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

/** Read the authored inline/computed value for a hovered property */
function readBaseValue(el: HTMLElement, prop: string): string {
  const style = el.style as CSSStyleDeclaration & Record<string, string>;
  const direct = style[prop];
  if (direct) return direct;

  const cssKey = toCssKey(prop);
  const inline = style.getPropertyValue(cssKey).trim();
  if (inline) return inline;

  const computed = getComputedStyle(el);
  if (prop === 'background') return computed.backgroundColor;
  if (prop === 'borderColor') return computed.borderTopColor;
  if (prop === 'color') return computed.color;
  if (prop === 'boxShadow') return computed.boxShadow;

  return computed.getPropertyValue(cssKey).trim();
}

function applyBase(el: HTMLElement, prop: string, value: string) {
  if (prop === 'background') {
    el.style.background = value;
    return;
  }
  if (prop === 'borderColor') {
    el.style.borderColor = value;
    return;
  }
  const cssKey = toCssKey(prop);
  if (value) el.style.setProperty(cssKey, value);
  else el.style.removeProperty(cssKey);
}

export function st(v: VividPolyView, css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const part of css.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const prop = camelKey(trimmed.slice(0, colon).trim());
    const val = trimmed.slice(colon + 1).trim();
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

  const baseValues: Record<string, string> = {};
  let captured = false;

  const captureBase = () => {
    if (captured) return;
    Object.keys(hoverStyles).forEach((k) => {
      baseValues[k] = readBaseValue(el, k);
    });
    captured = true;
  };

  const enter = () => {
    captureBase();
    Object.assign(el.style, hoverStyles);
  };

  const leave = () => {
    captureBase();
    Object.keys(hoverStyles).forEach((k) => {
      applyBase(el, k, baseValues[k] ?? '');
    });
  };

  el.addEventListener('mouseenter', enter);
  el.addEventListener('mouseleave', leave);
}

export function bindAllHovers(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll('[data-vp-hover]').forEach((el) => bindHover(el as HTMLElement));
}
