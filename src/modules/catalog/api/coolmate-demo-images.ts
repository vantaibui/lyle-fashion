/**
 * Shared demo imagery for men's products (academic demo). Real coolmate.me photos
 * downloaded into `public/coolmate/products/`, mirroring the elise women's setup
 * (`elise-demo-images.ts`): two angles per product (`men-NN.jpg` primary,
 * `men-NNb.jpg` alternate). Same {primary, alternate, alt} shape as the elise
 * helper so components render men's and women's products with no conditional logic.
 *
 * `menSeedImageSlot` maps a catalog seed index (0-based) to a men's image slot.
 * Only the six men's seeds are listed; other indices fall back to slot 1.
 */

import {
  type DemoImagePair,
  demoProductImages,
} from '@/modules/catalog/api/elise-demo-images';

const pad = (value: number) => String(value).padStart(2, '0');

// Catalog seed index -> [image slot 1..6, subcategory alt text].
const menSeeds: Record<number, { alt: string; slot: number }> = {
  0: { alt: 'Áo sơ mi nam Oxford premium', slot: 2 },
  3: { alt: 'Quần short nam năng động', slot: 4 },
  6: { alt: 'Set áo thun và quần thường ngày nam', slot: 5 },
  9: { alt: 'Quần dài nam Daily Pants', slot: 3 },
  10: { alt: 'Áo thun nam cotton regular fit', slot: 1 },
  11: { alt: 'Set áo sơ mi và quần cao cấp nam', slot: 6 },
};

/** True when the catalog seed at `index` is a men's product sourced from coolmate. */
export function isMenSeed(index: number): boolean {
  return index in menSeeds;
}

/** coolmate image pair for a men's seed index. Falls back to slot 1 if unmapped. */
export function coolmateProductImages(index: number): DemoImagePair {
  const seed = menSeeds[index] ?? { alt: 'Sản phẩm nam minh hoạ', slot: 1 };
  const slot = pad(seed.slot);
  return {
    alt: seed.alt,
    alternate: `/coolmate/products/men-${slot}b.jpg`,
    primary: `/coolmate/products/men-${slot}.jpg`,
  };
}

/**
 * Resolve the demo image pair for a catalog seed: coolmate.me for men's seeds,
 * elise.vn otherwise. Returns the same shape for both so adapters/components need
 * no gender branching.
 */
export function demoImagesForSeed(index: number): DemoImagePair {
  return isMenSeed(index)
    ? coolmateProductImages(index)
    : demoProductImages(index);
}
