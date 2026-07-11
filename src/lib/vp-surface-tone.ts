export type SurfaceTone = 'on-dark' | 'on-light';

const DARK_SURFACE_SELECTORS = [
  '.vp-site-footer',
  '.vp-hero-markets',
  '.vp-careers-hero',
  '.vp-chrome-gradient-surface',
  '.vp-knack-stats-bar',
  '[data-vp-surface="dark"]',
].join(', ');

const DARK_LUMINANCE_THRESHOLD = 0.38;

function parseBackgroundRgb(color: string) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] !== undefined ? Number(match[4]) : 1,
  };
}

function relativeLuminance(r: number, g: number, b: number) {
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function hasDarkSurfaceBackground(element: Element | null) {
  if (!element) return false;
  if (element.closest(DARK_SURFACE_SELECTORS)) return true;

  let node: Element | null = element;
  while (node && node !== document.documentElement) {
    const rgb = parseBackgroundRgb(getComputedStyle(node).backgroundColor);
    if (rgb && rgb.a > 0.08) {
      return relativeLuminance(rgb.r, rgb.g, rgb.b) < DARK_LUMINANCE_THRESHOLD;
    }

    node = node.parentElement;
  }

  return false;
}

export function readSurfaceToneAtPoint(x: number, y: number, ignoreSelector = '.vp-enquiry-fab'): SurfaceTone {
  const stack = document.elementsFromPoint(x, y);
  const backdrop = stack.find((node) => !node.closest(ignoreSelector));
  return hasDarkSurfaceBackground(backdrop ?? null) ? 'on-dark' : 'on-light';
}

type SurfaceToneOptions = {
  sideTab?: boolean;
  currentTone?: SurfaceTone;
};

function sampleTonePoints(rect: DOMRect, sideTab: boolean) {
  const sampleX = sideTab
    ? Math.min(rect.right + 24, window.innerWidth - 8)
    : Math.min(Math.max(rect.left + rect.width * 0.35, 8), window.innerWidth - 8);
  const midY = Math.min(Math.max(rect.top + rect.height * 0.5, 8), window.innerHeight - 8);
  const topY = Math.min(Math.max(rect.top + rect.height * 0.25, 8), window.innerHeight - 8);
  const bottomY = Math.min(Math.max(rect.top + rect.height * 0.75, 8), window.innerHeight - 8);

  return [
    readSurfaceToneAtPoint(sampleX, midY),
    readSurfaceToneAtPoint(sampleX, topY),
    readSurfaceToneAtPoint(sampleX, bottomY),
  ];
}

export function readSurfaceToneForElement(
  element: HTMLElement,
  options?: SurfaceToneOptions,
): SurfaceTone {
  const rect = element.getBoundingClientRect();
  const sideTab = options?.sideTab ?? false;
  const samples = sampleTonePoints(rect, sideTab);
  const darkCount = samples.filter((tone) => tone === 'on-dark').length;

  if (darkCount >= 2) return 'on-dark';
  if (darkCount === 0) return 'on-light';

  return options?.currentTone ?? samples[0] ?? 'on-light';
}
