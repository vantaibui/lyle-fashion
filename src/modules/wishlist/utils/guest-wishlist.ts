export const GUEST_WISHLIST_KEY = 'lyle:wishlist:v1';
export type GuestWishlistItem = {
  productId: string;
  selectedColorId?: string;
  selectedSizeId?: string;
  variantId?: string;
};

export function parseGuestWishlist(value: string | null): GuestWishlistItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is GuestWishlistItem =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as GuestWishlistItem).productId === 'string',
      )
      .slice(0, 100);
  } catch {
    return [];
  }
}

export function setGuestWishlistProduct(
  items: GuestWishlistItem[],
  productId: string,
  selected: boolean,
) {
  const without = items.filter((item) => item.productId !== productId);
  return selected ? [...without, { productId }] : without;
}
