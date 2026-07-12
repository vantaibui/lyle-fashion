import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { POST } from '@/app/api/cart/lines/route';
import { resetCommerceState } from '@/modules/cart/server/cart-store';

const cookieValues = new Map<string, string>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieValues.get(name);
      return value ? { value } : undefined;
    },
  }),
}));

describe('POST /api/cart/lines', () => {
  beforeEach(() => {
    cookieValues.clear();
    resetCommerceState();
  });

  it('accepts a valid simple SKU payload and returns a cart snapshot', async () => {
    const response = await POST(
      new Request('http://localhost/api/cart/lines', {
        body: JSON.stringify({
          productId: 'mock-product-1',
          quantity: 1,
          skuId: 'mock-product-1-bone-s',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      cart: {
        lines: [
          {
            lineType: 'simple',
            productId: 'mock-product-1',
            quantity: 1,
            skuId: 'mock-product-1-bone-s',
          },
        ],
      },
      lineCount: 1,
    });
    expect(response.headers.get('set-cookie')).toContain('lyle_cart=');
  });

  it('rejects bundle payloads that omit a required component', async () => {
    const response = await POST(
      new Request('http://localhost/api/cart/lines', {
        body: JSON.stringify({
          bundleId: 'bundle-men-casual-linen',
          components: [
            {
              componentId: 'bundle-7-top',
              productId: 'mock-product-1',
              sizeId: 'm',
              skuId: 'mock-product-1-moss-m',
            },
          ],
          lineType: 'bundle',
          productId: 'mock-product-7',
          quantity: 1,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });
});
