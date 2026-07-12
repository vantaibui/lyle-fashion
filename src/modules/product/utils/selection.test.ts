import { describe, expect, it } from 'vitest';

import { getMockProductBySlug } from '@/modules/product/api/mock-product-adapter';
import { resolveProductSelection } from '@/modules/product/utils/selection';

describe('resolveProductSelection', () => {
  it('falls back to the default color and flags an invalid query color', () => {
    const product = getMockProductBySlug('san-pham-minh-hoa-1');
    expect(product).not.toBeNull();
    const selection = resolveProductSelection(product!, { color: 'unknown' });

    expect(selection.selectedColor.colorId).toBe(product!.defaultColorId);
    expect(selection.issues.invalidColor).toBe(true);
  });

  it('keeps size selection scoped to the chosen color', () => {
    const product = getMockProductBySlug('san-pham-minh-hoa-1');
    expect(product).not.toBeNull();

    const selection = resolveProductSelection(product!, {
      color: 'ink',
      size: 'xl',
    });

    expect(selection.selectedSku).toBeDefined();
    expect(selection.selectedSku?.colorId).toBe('ink');
    expect(selection.selectedSku?.sizeId).toBe('xl');
  });

  it('flags an invalid size when it does not exist for the chosen color', () => {
    const product = getMockProductBySlug('san-pham-minh-hoa-1');
    expect(product).not.toBeNull();

    const selection = resolveProductSelection(product!, {
      color: 'bone',
      size: 'xxl',
    });

    expect(selection.selectedSku).toBeUndefined();
    expect(selection.issues.invalidSize).toBe(true);
  });
});
