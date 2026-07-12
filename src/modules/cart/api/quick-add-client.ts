import { browserApiRequest } from '@/lib/api/browser-client';
import type { CartResponse } from '@/modules/cart/api/cart-client';

export type QuickAddInput = {
  productId: string;
  quantity: 1;
  skuId: string;
};

export function quickAddToCart(input: QuickAddInput, signal?: AbortSignal) {
  return browserApiRequest<CartResponse>('/api/cart/lines', {
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    signal,
    timeoutMs: 8_000,
  });
}
