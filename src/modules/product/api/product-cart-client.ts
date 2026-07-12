import { browserApiRequest } from '@/lib/api/browser-client';
import type { CartResponse } from '@/modules/cart/api/cart-client';
import type { CartLineIntentInput } from '@/modules/cart/contracts/cart-intent';

export function createCartLineIntent(
  input: CartLineIntentInput,
  signal?: AbortSignal,
) {
  return browserApiRequest<CartResponse>('/api/cart/lines', {
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    signal,
    timeoutMs: 8_000,
  });
}
