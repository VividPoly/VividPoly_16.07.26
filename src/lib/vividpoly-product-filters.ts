/**
 * Catalogue filter matching: Capacity + Product Type only (per client catalogue UX).
 * Attribute maps derived from PDP spec content in vividpoly-data.ts / client PDF.
 */
import * as D from '@/data/vividpoly-data';

type Product = (typeof D.products)[0];

const PRODUCT_TYPE_IDS: Record<string, string> = {
  'Open mouth': 'open-mouth',
  'Stitched': 'stitched',
  'D-cut': 'd-cut',
  'Valve': 'valve',
  'Carry': 'carry',
  'Laminated': 'laminated',
  'Pinch bottom': 'pinch-bottom',
  'Block bottom': 'block-bottom',
  'Block bottom gusset': 'gusset',
  'Woven shopping': 'shopping',
};

/** Maps each product to industry/use groups from useRows + useGroups. */
const BAG_PHRASE_TO_ID: [string, string][] = [
  ['block bottom gusset', 'gusset'],
  ['top and bottom stitched', 'stitched'],
  ['open mouth', 'open-mouth'],
  ['pinch bottom', 'pinch-bottom'],
  ['block bottom', 'block-bottom'],
  ['woven shopping', 'shopping'],
  ['printed laminated', 'laminated'],
  ['laminated', 'laminated'],
  ['stitched', 'stitched'],
  ['d-cut', 'd-cut'],
  ['valve', 'valve'],
  ['carry', 'carry'],
  ['shopping', 'shopping'],
];

export function parseBagIdsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const ids = new Set<string>();
  for (const [phrase, id] of BAG_PHRASE_TO_ID) {
    if (lower.includes(phrase)) ids.add(id);
  }
  return [...ids];
}

/** Parse bag IDs preserving comma-segment order from client guidance (best fit first). */
export function parseBagIdsFromTextOrdered(text: string): string[] {
  const segments = text.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const ids: string[] = [];
  const seen = new Set<string>();

  for (const segment of segments) {
    for (const [phrase, id] of BAG_PHRASE_TO_ID) {
      if (segment.includes(phrase) && !seen.has(id)) {
        ids.push(id);
        seen.add(id);
        break;
      }
    }
  }

  return ids;
}

export type CatSort = 'recommended' | `pack-${number}`;

export function buildCatSortOptions(
  useGuidance: Array<{ title: string }>,
  allProductsLabel: string,
): { value: CatSort; label: string }[] {
  return [
    { value: 'recommended', label: allProductsLabel },
    ...useGuidance.map((entry, i) => ({
      value: `pack-${i}` as CatSort,
      label: entry.title,
    })),
  ];
}

export const CAT_SORT_OPTIONS: { value: CatSort; label: string }[] = buildCatSortOptions(
  D.useGuidance,
  'All products',
);

function getGuidanceIdx(
  sort: CatSort,
  guidance: Array<{ bags: string; bagIds?: string[] }> = D.useGuidance,
): number | null {
  if (sort === 'recommended') return null;
  const match = sort.match(/^pack-(\d+)$/);
  if (!match) return null;
  const idx = Number(match[1]);
  return guidance[idx] ? idx : null;
}

export function productRecommendedForSort(
  p: Product,
  sort: CatSort,
  guidance: Array<{ bags: string; bagIds?: string[] }> = D.useGuidance,
): boolean {
  const idx = getGuidanceIdx(sort, guidance);
  if (idx === null) return false;
  const entry = guidance[idx];
  const ids = entry.bagIds?.length ? entry.bagIds : parseBagIdsFromText(entry.bags);
  return ids.includes(p.id);
}

export const CAPACITY_STOPS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75] as const;

/** Explicit capacity support per product (from PDP spec tables in client content). */
const PRODUCT_CAPACITY: Record<string, { stops: number[]; custom: boolean }> = {
  'open-mouth': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'stitched': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'd-cut': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'valve': { stops: [20, 25, 30, 40, 50, 60, 75], custom: true },
  'carry': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'laminated': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'pinch-bottom': { stops: [5, 10, 15, 20, 25, 30, 40, 50], custom: true },
  'block-bottom': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'gusset': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
  'shopping': { stops: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], custom: true },
};

function matchesCapacity(p: Product, option: string): boolean {
  const cap = PRODUCT_CAPACITY[p.id];
  if (!cap) return false;
  if (option === 'Custom') return cap.custom;
  const kg = parseInt(option, 10);
  if (Number.isNaN(kg)) return false;
  return cap.stops.includes(kg);
}

export function productMatchesCapacityRange(
  p: Product,
  minKg: number,
  maxKg: number,
): boolean {
  const cap = PRODUCT_CAPACITY[p.id];
  if (!cap) return false;
  if (cap.stops.some((kg) => kg >= minKg && kg <= maxKg)) return true;
  if (!cap.custom) return false;
  const bagMin = Math.min(...cap.stops);
  const bagMax = Math.max(...cap.stops);
  return bagMax >= minKg && bagMin <= maxKg;
}

export const CAPACITY_MIN_KG = 5;
export const CAPACITY_MAX_KG = 75;

export function parseCustomCapacityKg(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const kg = Math.round(parseFloat(match[1]));
  return Number.isNaN(kg) ? null : kg;
}

export function getCapacityCustomNotice(value: string, template?: string): string | null {
  const kg = parseCustomCapacityKg(value);
  if (kg === null) return null;
  if (kg < CAPACITY_MIN_KG || kg > CAPACITY_MAX_KG) {
    if (template) {
      return template.replace('{min}', String(CAPACITY_MIN_KG)).replace('{max}', String(CAPACITY_MAX_KG));
    }
    return `VIVIDPOLY provides PP bag packaging between ${CAPACITY_MIN_KG} kg and ${CAPACITY_MAX_KG} kg. Please enter a capacity within this range.`;
  }
  return null;
}

export function productMatchesCustomCapacityKg(p: Product, kg: number): boolean {
  const cap = PRODUCT_CAPACITY[p.id];
  if (!cap) return false;
  if (cap.stops.includes(kg)) return true;
  if (!cap.custom) return false;
  const bagMin = Math.min(...cap.stops);
  const bagMax = Math.max(...cap.stops);
  return kg >= bagMin && kg <= bagMax;
}

export function isCapacityFilterActive(
  minIdx: number,
  maxIdx: number,
  customKgRaw: string,
): boolean {
  const kg = parseCustomCapacityKg(customKgRaw);
  if (kg !== null && kg >= CAPACITY_MIN_KG && kg <= CAPACITY_MAX_KG) return true;
  return minIdx > 0 || maxIdx < CAPACITY_STOPS.length - 1;
}

export function filterProductsByCapacity(
  products: Product[],
  minIdx: number,
  maxIdx: number,
  customKgRaw: string,
): Product[] {
  const minKg = CAPACITY_STOPS[minIdx];
  const maxKg = CAPACITY_STOPS[maxIdx];
  const customKg = parseCustomCapacityKg(customKgRaw);
  const validCustom = customKg !== null && customKg >= CAPACITY_MIN_KG && customKg <= CAPACITY_MAX_KG;
  const rangeActive = minIdx > 0 || maxIdx < CAPACITY_STOPS.length - 1;

  if (!rangeActive && !validCustom) return products;

  return products.filter((p) => {
    let ok = true;
    if (rangeActive) ok = productMatchesCapacityRange(p, minKg, maxKg);
    if (validCustom) ok = ok && productMatchesCustomCapacityKg(p, customKg);
    return ok;
  });
}

export function isCapacityRangeFilterActive(
  minIdx: number,
  maxIdx: number,
  _includeCustom: boolean,
): boolean {
  return isCapacityFilterActive(minIdx, maxIdx, '');
}

function matchesProductType(p: Product, option: string): boolean {
  const id = PRODUCT_TYPE_IDS[option];
  return id ? p.id === id : false;
}

const SECTION_MATCHERS: Record<string, (p: Product, option: string) => boolean> = {
  Capacity: matchesCapacity,
  'Product Type': matchesProductType,
};

export function productMatchesFilterOption(
  p: Product,
  section: string,
  option: string,
): boolean {
  const matcher = SECTION_MATCHERS[section];
  if (!matcher) return true;
  return matcher(p, option);
}

export function productMatchesAllFilters(
  p: Product,
  filters: Record<string, Record<string, boolean>>,
): boolean {
  for (const [section, opts] of Object.entries(filters)) {
    if (section === 'Capacity') continue;
    const selected = Object.entries(opts || {})
      .filter(([, on]) => on)
      .map(([label]) => label);
    if (selected.length === 0) continue;
    if (!selected.some((opt) => productMatchesFilterOption(p, section, opt))) return false;
  }
  return true;
}

export function filterProducts(
  products: Product[],
  filters: Record<string, Record<string, boolean>>,
): Product[] {
  const hasActive = Object.values(filters).some((sec) =>
    Object.values(sec || {}).some(Boolean),
  );
  if (!hasActive) return products;
  return products.filter((p) => productMatchesAllFilters(p, filters));
}

export function catSortFromUseTitle(title: string): CatSort {
  const idx = D.useGuidance.findIndex((entry) => entry.title === title);
  return idx >= 0 ? (`pack-${idx}` as CatSort) : 'recommended';
}

/** Sidebar filter state that matches a selected industry / use. */
export function filtersForUseSort(sort: CatSort): Record<string, Record<string, boolean>> {
  const idx = getGuidanceIdx(sort);
  if (idx === null) return {};
  const ids = new Set(parseBagIdsFromTextOrdered(D.useGuidance[idx].bags));
  const productType: Record<string, boolean> = {};
  for (const [label, id] of Object.entries(PRODUCT_TYPE_IDS)) {
    if (ids.has(id)) productType[label] = true;
  }
  return { 'Product Type': productType };
}

/** When a specific use is selected, keep only bags recommended for that use. */
export function filterProductsByUseSort(products: Product[], sort: CatSort): Product[] {
  if (sort === 'recommended') return products;
  return products.filter((p) => productRecommendedForSort(p, sort));
}

export function sortProducts(products: Product[], sort: CatSort): Product[] {
  const list = [...products];
  const idx = getGuidanceIdx(sort);
  if (idx === null) return list;

  const indexOf = new Map(products.map((p, i) => [p.id, i]));

  return list.sort((a, b) => {
    const aMatch = productRecommendedForSort(a, sort) ? 0 : 1;
    const bMatch = productRecommendedForSort(b, sort) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return (indexOf.get(a.id) ?? 0) - (indexOf.get(b.id) ?? 0);
  });
}
