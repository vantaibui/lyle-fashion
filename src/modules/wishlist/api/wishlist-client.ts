import { browserApiRequest } from '@/lib/api/browser-client';
import {
  GUEST_WISHLIST_KEY,
  parseGuestWishlist,
  setGuestWishlistProduct,
} from '@/modules/wishlist/utils/guest-wishlist';

export async function setWishlistProduct(
  productId: string,
  selected: boolean,
  signal?: AbortSignal,
) {
  const result = await browserApiRequest<unknown>('/api/wishlist/items', {
    body: JSON.stringify({ productId, selected }),
    headers: { 'Content-Type': 'application/json' },
    method: selected ? 'POST' : 'DELETE',
    signal,
    timeoutMs: 8_000,
  });
  try {
    const next = setGuestWishlistProduct(
      parseGuestWishlist(window.localStorage.getItem(GUEST_WISHLIST_KEY)),
      productId,
      selected,
    );
    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('lyle:wishlist-change'));
  } catch {
    // Storage may be unavailable; the server request still succeeded.
  }
  return result;
}
