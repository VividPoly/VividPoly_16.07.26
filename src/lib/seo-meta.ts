import type { VividPolyState } from '@/hooks/useVividPoly';

/**
 * SEO meta titles + descriptions, sourced from the marketing team's sheet.
 * The public site is a hash-based SPA, so only the root URL (`/`) is
 * server-rendered and crawlable — its metadata lives in `src/app/layout.tsx`
 * (kept in sync with the `home` entry below). Every other "page" is a client
 * screen reached via a `#hash`, so its title/description is applied at runtime
 * as the visitor navigates (see the SEO effect in `useVividPoly`).
 */
export interface SeoMeta {
  title: string;
  description: string;
}

/** Root / home page — mirror of the `<title>`/description in layout.tsx. */
export const HOME_SEO: SeoMeta = {
  title: 'PP Bags & Woven Bags Exporter from India | VIVIDPOLY',
  description:
    'VIVIDPOLY exports PP woven bags, valve, laminated and custom packaging from India to global buyers. Request samples and bulk export quotes today.',
};

/** Per-screen meta for the non-product screens. */
const SCREEN_SEO: Partial<Record<VividPolyState['screen'], SeoMeta>> = {
  home: HOME_SEO,
  about: {
    title: 'About VIVIDPOLY | PP Bag Exporter in India',
    description:
      'Learn how VIVIDPOLY supports global buyers with export-grade PP bags, custom construction, printing and responsive sourcing support from India.',
  },
  contact: {
    title: 'Contact VIVIDPOLY | PP Bags Exporter in India',
    description:
      'Contact VIVIDPOLY for PP bag export enquiries. Share your bag type, size, printing, quantity and destination for a fast, practical quotation.',
  },
  blog: {
    title: 'News & PP Packaging Updates | VIVIDPOLY India',
    description:
      'News, updates and practical guidance on PP woven bag packaging, export standards and product selection from VIVIDPOLY, a PP bag exporter in India.',
  },
};

/** Catalogue screen meta, split by the active tab (product type vs. use/industry). */
const CATALOGUE_SEO: Record<VividPolyState['cat'], SeoMeta> = {
  type: {
    title: 'PP Bag Types & Product Range | VIVIDPOLY India',
    description:
      'Explore the full VIVIDPOLY PP bag range: open mouth, stitched, D-cut, valve, carry, laminated, pinch and block bottom bags exported from India.',
  },
  use: {
    title: 'PP Bags by Industry & Use | VIVIDPOLY India',
    description:
      'Find the right PP bag by industry: grains, fertilizer, animal feed, cement, salt, sugar and retail. Export packaging guidance from India.',
  },
};

/** Per-product PDP meta, keyed by product id (`state.pid`). */
const PRODUCT_SEO: Record<string, SeoMeta> = {
  'open-mouth': {
    title: 'Open Mouth PP Bags Exporter India | VIVIDPOLY',
    description:
      'Export-grade open mouth PP woven bags for grains, flour, feed, fertilizer, salt, sugar and minerals. Custom sizes 5 to 75 kg supplied from India.',
  },
  stitched: {
    title: 'Stitched PP Woven Bags Exporter India | VIVIDPOLY',
    description:
      'Secure top and bottom stitched PP bags for transport, storage and export of agricultural and industrial products. Custom sizes made in India.',
  },
  'd-cut': {
    title: 'D-Cut PP Woven Bags Exporter India | VIVIDPOLY',
    description:
      'Carry-style D-cut PP woven bags with a built-in handle for retail, promotion and reusable packaging. Custom printed and exported from India.',
  },
  valve: {
    title: 'Valve PP Bags Exporter from India | VIVIDPOLY',
    description:
      'Valve-filling PP bags for cement, chemicals, minerals, powders and construction materials. Export-grade, custom sizes 5 to 75 kg from India.',
  },
  carry: {
    title: 'PP Woven Carry Bags Exporter India | VIVIDPOLY',
    description:
      'Strong, brandable woven PP carry bags for retail, trade and promotional use. Custom printing and export packing from India for global buyers.',
  },
  laminated: {
    title: 'Laminated Woven PP Bags Exporter India | VIVIDPOLY',
    description:
      'Premium printed and laminated woven PP bags for rice, flour, feed, pet food, fertilizer and seeds. High-quality branding and export from India.',
  },
  'pinch-bottom': {
    title: 'Pinch Bottom PP Bags Exporter India | VIVIDPOLY',
    description:
      'Premium printed laminated pinch bottom PP bags with clean closure for retail-ready packaging of food, feed, grains and seeds. Made in India.',
  },
  'block-bottom': {
    title: 'Block Bottom PP Bags Exporter India | VIVIDPOLY',
    description:
      'Stable-shape printed laminated block bottom PP bags for better stacking, display and export presentation. Custom print and sizes from India.',
  },
  gusset: {
    title: 'Gusset PP Bags Exporter from India | VIVIDPOLY',
    description:
      'High-volume block bottom gusset PP bags with a strong branding area and stable filled shape. Export-grade laminated packaging from India.',
  },
  shopping: {
    title: 'Woven Shopping Bags Exporter India | VIVIDPOLY',
    description:
      'Reusable woven PP shopping bags for retail chains, supermarkets, exhibitions and promotions. Custom printed and exported from India in bulk.',
  },
  fabric: {
    title: 'PP Woven Fabric Exporter from India | VIVIDPOLY',
    description:
      'PP woven fabric in rolls and cut lengths for industrial, agricultural and conversion use. Export-grade fabric supplied from India in bulk.',
  },
  'weed-barrier': {
    title: 'Weed Barrier Fabric Exporter India | VIVIDPOLY',
    description:
      'Durable PP woven weed barrier fabric for landscaping, agriculture and ground cover. Export-grade rolls supplied from India for global buyers.',
  },
};

/**
 * Resolve the SEO title + description for the current SPA screen state.
 * Falls back to the home meta for screens without a dedicated entry
 * (e.g. quote, sample, faqs, careers) so the tab never shows a stale title.
 */
export function getSeoMeta(
  state: Pick<VividPolyState, 'screen' | 'pid' | 'cat'>,
): SeoMeta {
  if (state.screen === 'pdp') {
    return PRODUCT_SEO[state.pid] ?? HOME_SEO;
  }
  if (state.screen === 'catalogue') {
    return CATALOGUE_SEO[state.cat] ?? CATALOGUE_SEO.type;
  }
  return SCREEN_SEO[state.screen] ?? HOME_SEO;
}
