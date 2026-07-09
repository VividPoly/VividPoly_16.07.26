/** Primary and optional gallery filenames under /public/images/products/ */
const PRODUCT_GALLERY: Record<string, string[]> = {
  'open-mouth': ['open-mouth', 'open-mouth-2'],
  stitched: ['stitched', 'stitched-2', 'stitched-3', 'stitched-bopp'],
  'd-cut': ['d-cut'],
  valve: ['valve', 'valve-2'],
  carry: ['carry'],
  laminated: ['laminated', 'laminated-2'],
  'pinch-bottom': ['pinch-bottom', 'pinch-bottom-2'],
  'block-bottom': ['block-bottom', 'block-bottom-2'],
  gusset: ['gusset'],
  shopping: ['shopping'],
  fabric: ['fabric'],
  valve: ['valve', 'valve-2'],
  'weed-barrier': ['weed-barrier'],
  tape: ['tape'],
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
