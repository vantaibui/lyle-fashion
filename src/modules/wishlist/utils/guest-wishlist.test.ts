import { describe, expect, it } from 'vitest';
import { parseGuestWishlist, setGuestWishlistProduct } from './guest-wishlist';

describe('guest wishlist persistence', () => {
  it('recovers from corrupted storage', () =>
    expect(parseGuestWishlist('{bad')).toEqual([]));
  it('deduplicates products', () =>
    expect(setGuestWishlistProduct([{ productId: 'p1' }], 'p1', true)).toEqual([
      { productId: 'p1' },
    ]));
});
