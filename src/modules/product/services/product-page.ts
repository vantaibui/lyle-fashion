import { cache } from 'react';

import { mockProductAdapter } from '@/modules/product/api/mock-product-adapter';
import type {
  ProductPageData,
  ProductSearchState,
} from '@/modules/product/contracts/product';
import { resolveProductSelection } from '@/modules/product/utils/selection';

const getProductPageDataCached = cache(
  async (slug: string, searchJson: string): Promise<ProductPageData | null> => {
    const productResult = await mockProductAdapter(slug, {});
    if (productResult.error || !productResult.data) return null;

    const product = productResult.data;
    if (product.status === 'draft' || product.status === 'archived')
      return null;

    const searchState = JSON.parse(searchJson) as ProductSearchState;

    return {
      product,
      recommendationsError: null,
      selection: resolveProductSelection(product, searchState),
    };
  },
);

export function getProductPageData(
  slug: string,
  searchState: ProductSearchState,
) {
  return getProductPageDataCached(slug, JSON.stringify(searchState));
}
