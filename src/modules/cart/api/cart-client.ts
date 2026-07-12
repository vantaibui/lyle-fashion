import { browserApiRequest } from '@/lib/api/browser-client';
import type { Cart } from '@/modules/cart/contracts/cart';
import type {
  CheckoutInput,
  CheckoutResult,
} from '@/modules/checkout/contracts/checkout';
import type { PromotionAttemptResult } from '@/modules/promotion/contracts/promotion';

export type FreeShippingProgress = {
  current: number;
  remaining: number;
  threshold: number;
};

export type CartResponse = {
  cart: Cart;
  freeShippingProgress: FreeShippingProgress;
  mergeSummary?: Cart['mergeSummary'];
  promotionResult?: PromotionAttemptResult;
  requestId: string;
};

export const cartUpdatedEventName = 'lyle:cart-updated';

export function dispatchCartUpdated(options: {
  openDrawer?: boolean;
  source: 'checkout' | 'drawer' | 'header' | 'pdp' | 'plp';
}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(cartUpdatedEventName, {
      detail: options,
    }),
  );
}

export function getCart() {
  return browserApiRequest<CartResponse>('/api/cart', {
    method: 'GET',
    retries: 1,
    timeoutMs: 8_000,
  });
}

export function updateCartLine(lineId: string, quantity: number) {
  return browserApiRequest<CartResponse>(`/api/cart/lines/${lineId}`, {
    body: JSON.stringify({ quantity }),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    timeoutMs: 8_000,
  });
}

export function removeCartLine(lineId: string) {
  return browserApiRequest<CartResponse>(`/api/cart/lines/${lineId}`, {
    method: 'DELETE',
    timeoutMs: 8_000,
  });
}

export function moveCartLineToWishlist(lineId: string) {
  return browserApiRequest<CartResponse>(
    `/api/cart/lines/${lineId}/move-to-wishlist`,
    {
      method: 'POST',
      timeoutMs: 8_000,
    },
  );
}

export function applyCartPromotion(code: string) {
  return browserApiRequest<CartResponse>('/api/cart/promotions', {
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    timeoutMs: 8_000,
  });
}

export function removeCartPromotion(code: string) {
  return browserApiRequest<CartResponse>(
    `/api/cart/promotions/${encodeURIComponent(code)}`,
    {
      method: 'DELETE',
      timeoutMs: 8_000,
    },
  );
}

export function estimateShipping(input: {
  districtCode: string;
  districtName: string;
  method: 'express' | 'pickup' | 'standard';
  provinceCode: string;
  provinceName: string;
}) {
  return browserApiRequest<CartResponse>('/api/cart/shipping-estimate', {
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    timeoutMs: 8_000,
  });
}

export function submitCheckout(input: CheckoutInput, idempotencyKey: string) {
  return browserApiRequest<{ checkout: CheckoutResult; requestId: string }>(
    '/api/checkout',
    {
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': idempotencyKey,
      },
      method: 'POST',
      timeoutMs: 12_000,
    },
  );
}
