import { describe, expect, it } from 'vitest';

import { cacheTags } from '@/lib/cache/tags';

describe('cache tags', () => {
  it('creates stable scoped tags', () => {
    expect(cacheTags.product('product_123')).toBe('lyle:product:product_123');
  });

  it('rejects unsafe tag identifiers', () => {
    expect(() => cacheTags.product('product:123')).toThrow();
  });
});
