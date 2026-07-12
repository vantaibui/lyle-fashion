import { describe, expect, it } from 'vitest';

import {
  accountOrderParamsSchema,
  productParamsSchema,
} from '@/lib/validation/route-params';

describe('route parameter schemas', () => {
  it('accepts normalized product slugs', () => {
    expect(
      productParamsSchema.safeParse({ slug: 'ao-linen-nam' }).success,
    ).toBe(true);
  });

  it('rejects unsafe or non-normalized slugs', () => {
    expect(productParamsSchema.safeParse({ slug: '../admin' }).success).toBe(
      false,
    );
    expect(productParamsSchema.safeParse({ slug: 'Ao Linen' }).success).toBe(
      false,
    );
  });

  it('rejects order IDs with path delimiters', () => {
    expect(accountOrderParamsSchema.safeParse({ orderId: 'A/1' }).success).toBe(
      false,
    );
  });
});
