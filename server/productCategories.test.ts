import { describe, it, expect } from 'vitest';
import { productCategories, findProductBySlug } from '../client/src/data/productCategories';

// All slugs that should exist in the system
const mainCategorySlugs = [
  'pp-woven-fabric',
  'pp-woven-bags',
  'bopp-laminated-bags'
];

const ppWovenBagsSubcategorySlugs = [
  'open-mouth-pp-bags',
  'top-bottom-stitched',
  'd-cut-pp-bags',
  'valve-bags',
  'carry-bags',
  'pinch-bottom-bags',
  'block-bottom-bags',
  'bottom-gusset-bags'
];

const boppLaminatedSubcategorySlugs = [
  'bopp-open-mouth',
  'bopp-top-bottom-stitched',
  'bopp-d-cut',
  'bopp-valve-bags',
  'bopp-carry-bags',
  'bopp-pinch-bottom',
  'bopp-block-bottom',
  'bopp-bottom-gusset'
];

describe('Product Categories Data', () => {
  it('should have 3 main product categories', () => {
    expect(productCategories.length).toBe(3);
  });

  it('should find all main category slugs', () => {
    for (const slug of mainCategorySlugs) {
      const product = findProductBySlug(slug);
      expect(product).not.toBeNull();
      expect(product?.slug).toBe(slug);
    }
  });

  it('should have PP Woven Bags with 8 subcategories', () => {
    const ppWovenBags = findProductBySlug('pp-woven-bags');
    expect(ppWovenBags).not.toBeNull();
    expect(ppWovenBags?.subCategories).toBeDefined();
    expect(ppWovenBags?.subCategories?.length).toBe(8);
  });

  it('should have BOPP Laminated Bags with 8 subcategories', () => {
    const boppBags = findProductBySlug('bopp-laminated-bags');
    expect(boppBags).not.toBeNull();
    expect(boppBags?.subCategories).toBeDefined();
    expect(boppBags?.subCategories?.length).toBe(8);
  });

  it('should find all PP Woven Bags subcategory slugs', () => {
    for (const slug of ppWovenBagsSubcategorySlugs) {
      const product = findProductBySlug(slug);
      expect(product).not.toBeNull();
      expect(product?.slug).toBe(slug);
    }
  });

  it('should find all BOPP Laminated Bags subcategory slugs', () => {
    for (const slug of boppLaminatedSubcategorySlugs) {
      const product = findProductBySlug(slug);
      expect(product).not.toBeNull();
      expect(product?.slug).toBe(slug);
    }
  });

  it('should have required fields for each main category', () => {
    for (const category of productCategories) {
      expect(category.id).toBeDefined();
      expect(category.slug).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.introduction).toBeDefined();
      expect(category.features).toBeDefined();
      expect(category.benefits).toBeDefined();
      expect(category.specifications).toBeDefined();
      expect(category.images).toBeDefined();
      expect(category.images.length).toBeGreaterThan(0);
    }
  });

  it('should have required fields for each subcategory', () => {
    const ppWovenBags = findProductBySlug('pp-woven-bags');
    const boppBags = findProductBySlug('bopp-laminated-bags');
    
    const allSubcategories = [
      ...(ppWovenBags?.subCategories || []),
      ...(boppBags?.subCategories || [])
    ];

    for (const sub of allSubcategories) {
      expect(sub.id).toBeDefined();
      expect(sub.slug).toBeDefined();
      expect(sub.name).toBeDefined();
      expect(sub.introduction).toBeDefined();
      expect(sub.features).toBeDefined();
      expect(sub.benefits).toBeDefined();
      expect(sub.specifications).toBeDefined();
      expect(sub.images).toBeDefined();
      expect(sub.images.length).toBeGreaterThan(0);
    }
  });

  it('should not have Reprocessed Granules category', () => {
    const reprocessed = findProductBySlug('reprocessed-granules');
    expect(reprocessed).toBeUndefined();
  });
});
