import { describe, expect, it } from 'vitest';

import { getMockProductBySlug } from '@/modules/product/api/mock-product-adapter';
import { createProductMetadata } from '@/modules/product/services/product-metadata';
import { resolveProductSelection } from '@/modules/product/utils/selection';

describe('product metadata', () => {
  it('keeps the canonical URL on the base product route', () => {
    const product = getMockProductBySlug('san-pham-minh-hoa-1');
    expect(product).not.toBeNull();

    const metadata = createProductMetadata({
      product: product!,
      recommendationsError: null,
      selection: resolveProductSelection(product!, {
        color: 'ink',
        size: 'm',
      }),
    });

    expect(metadata.alternates).toEqual({
      canonical: 'http://localhost:3000/product/san-pham-minh-hoa-1',
    });
    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
      nocache: true,
    });
  });
});
