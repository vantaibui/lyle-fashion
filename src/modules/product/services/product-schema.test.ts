import { describe, expect, it } from 'vitest';

import { getProductPageData } from '@/modules/product/services/product-page';
import { createProductJsonLd } from '@/modules/product/services/product-schema';

describe('createProductJsonLd', () => {
  it('creates truthful product schema from visible product data', async () => {
    const data = await getProductPageData('san-pham-minh-hoa-1', {
      color: 'bone',
      size: 's',
    });

    expect(data).not.toBeNull();
    if (!data) return;

    const jsonLd = createProductJsonLd(data);

    expect(jsonLd).toMatchObject({
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: 'LYLE Fashion',
      },
      name: data.product.name,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'VND',
      },
      url: `http://localhost:3000/product/${data.product.slug}`,
    });
  });
});
