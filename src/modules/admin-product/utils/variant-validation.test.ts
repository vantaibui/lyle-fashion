import { describe, expect, it } from 'vitest';

import { findVariantValidationIssues } from './variant-validation';
import type { AdminProductVariant } from '@/modules/admin-product/contracts/admin-product-detail';

function variant(overrides: Partial<AdminProductVariant>): AdminProductVariant {
  return {
    colorId: 'natural',
    colorLabel: 'Tự nhiên',
    id: 'variant-1',
    price: 399000,
    reserved: 0,
    safetyStock: 5,
    sizeId: 'm',
    sizeLabel: 'M',
    skuCode: 'SKU-1',
    status: 'active',
    stockOnHand: 10,
    ...overrides,
  };
}

describe('findVariantValidationIssues', () => {
  it('reports no issues for distinct SKUs and combinations', () => {
    const issues = findVariantValidationIssues([
      variant({ id: 'v1', sizeId: 'm', skuCode: 'SKU-1' }),
      variant({ id: 'v2', sizeId: 'l', skuCode: 'SKU-2' }),
    ]);
    expect(issues).toHaveLength(0);
  });

  it('flags a duplicate SKU code', () => {
    const issues = findVariantValidationIssues([
      variant({ id: 'v1', sizeId: 'm', skuCode: 'SKU-1' }),
      variant({ id: 'v2', sizeId: 'l', skuCode: 'sku-1' }),
    ]);
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ variantId: 'v2' })]),
    );
  });

  it('flags a duplicate color/size combination', () => {
    const issues = findVariantValidationIssues([
      variant({ id: 'v1', colorId: 'natural', sizeId: 'm', skuCode: 'SKU-1' }),
      variant({ id: 'v2', colorId: 'natural', sizeId: 'm', skuCode: 'SKU-2' }),
    ]);
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ variantId: 'v2' })]),
    );
  });
});
