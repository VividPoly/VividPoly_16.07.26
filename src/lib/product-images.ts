/** Primary and optional gallery filenames under /public/images/products/ */
const PRODUCT_GALLERY: Record<string, string[]> = {
  'open-mouth': ['open-mouth'],
  stitched: ['stitched'],
  'd-cut': ['d-cut', 'd-cut-2', 'd-cut-3', 'd-cut-4', 'd-cut-5'],
  valve: ['valve'],
  carry: ['carry', 'carry-2', 'carry-3', 'carry-4', 'carry-5'],
  laminated: ['laminated', 'laminated-2', 'laminated-3', 'laminated-4', 'laminated-5'],
  'pinch-bottom': ['pinch-bottom', 'pinch-bottom-2', 'pinch-bottom-3', 'pinch-bottom-4', 'pinch-bottom-5'],
  'block-bottom': ['block-bottom', 'block-bottom-2', 'block-bottom-3', 'block-bottom-4', 'block-bottom-5'],
  gusset: ['gusset', 'gusset-2', 'gusset-3', 'gusset-4', 'gusset-5'],
  shopping: ['shopping'],
  fabric: ['fabric', 'fabric-2', 'fabric-3', 'fabric-4', 'fabric-5'],
  'weed-barrier': ['weed-barrier'],
};

export function productImageSrc(id: string, index = 0): string {
  const keys = PRODUCT_GALLERY[id] || [id];
  const key = keys[Math.min(index, keys.length - 1)] || id;
  return `/images/products/${key}.jpg`;
}

export function productGallerySrcs(id: string): string[] {
  const keys = PRODUCT_GALLERY[id] || [id];
  return keys.map((key) => `/images/products/${key}.jpg`);
}
