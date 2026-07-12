import { describe, expect, it } from 'vitest';

import { calculateDiscountPercentage } from '@/modules/catalog/utils/discount';

describe('discount percentage', () => {
  it('calculates a rounded percentage only when display is allowed', () => {
    expect(calculateDiscountPercentage(699000, 799000, true)).toBe(13);
    expect(calculateDiscountPercentage(699000, 799000, false)).toBeNull();
  });

  it('rejects invalid compare-at values', () => {
    expect(calculateDiscountPercentage(799000, 699000, true)).toBeNull();
    expect(calculateDiscountPercentage(-1, 799000, true)).toBeNull();
  });
});
