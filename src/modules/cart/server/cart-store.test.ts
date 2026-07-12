import { beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  addLineToCart,
  applyShippingEstimate,
  applyPromotionCode,
  getCartForCookies,
  resetCommerceState,
  submitCheckout,
} from '@/modules/cart/server/cart-store';
import {
  cartCookieName,
  customerCookieName,
} from '@/modules/cart/server/cart-store';

function createCookieStore(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    get(name: string) {
      const value = values.get(name);
      return value ? { value } : undefined;
    },
    setFromHeader(header?: string) {
      if (!header) return;
      const [cookie] = header.split(';');
      if (!cookie) return;
      const [name, value] = cookie.split('=');
      if (name && value) values.set(name, value);
    },
  };
}

describe('cart-store', () => {
  beforeEach(() => {
    resetCommerceState();
  });

  it('creates and restores a guest cart from the opaque cookie token', () => {
    const cookieStore = createCookieStore();
    const created = addLineToCart(cookieStore, {
      productId: 'mock-product-1',
      quantity: 1,
      skuId: 'mock-product-1-bone-s',
    });
    cookieStore.setFromHeader(created.setCartCookie);

    const restored = getCartForCookies(cookieStore);

    expect(restored.cart.lines).toHaveLength(1);
    expect(restored.cart.lines[0]?.skuId).toBe('mock-product-1-bone-s');
  });

  it('merges duplicate variants into the authenticated cart foundation', () => {
    const guestStore = createCookieStore();
    const guestCart = addLineToCart(guestStore, {
      productId: 'mock-product-1',
      quantity: 1,
      skuId: 'mock-product-1-bone-s',
    });
    guestStore.setFromHeader(guestCart.setCartCookie);

    const accountStore = createCookieStore({
      [customerCookieName]: 'customer-1',
    });
    const accountCart = addLineToCart(accountStore, {
      productId: 'mock-product-1',
      quantity: 1,
      skuId: 'mock-product-1-bone-s',
    });
    accountStore.setFromHeader(accountCart.setCartCookie);

    const mergedStore = createCookieStore({
      [cartCookieName]: guestStore.get(cartCookieName)?.value ?? '',
      [customerCookieName]: 'customer-1',
    });

    const merged = getCartForCookies(mergedStore);

    expect(merged.cart.lines).toHaveLength(1);
    expect(merged.cart.lines[0]?.quantity).toBe(2);
    expect(merged.mergeSummary?.mergedLineCount).toBe(1);
  });

  it('keeps development promotion logic on the server side', () => {
    const cookieStore = createCookieStore();
    const cartResult = addLineToCart(cookieStore, {
      productId: 'mock-product-5',
      quantity: 1,
      skuId: 'mock-product-5-ink-s',
    });
    cookieStore.setFromHeader(cartResult.setCartCookie);

    const promotion = applyPromotionCode(cookieStore, 'DEV10');

    expect(promotion.promotionResult.code).toBe('APPLIED');
    expect(promotion.cart.totals.discountTotal).toBeGreaterThan(0);
    expect(promotion.cart.promotionCodes[0]?.isDevelopmentMock).toBe(true);
  });

  it('reuses the same checkout result for duplicate idempotent submission', () => {
    const cookieStore = createCookieStore();
    const cartResult = addLineToCart(cookieStore, {
      productId: 'mock-product-5',
      quantity: 1,
      skuId: 'mock-product-5-ink-s',
    });
    cookieStore.setFromHeader(cartResult.setCartCookie);

    const refreshed = getCartForCookies(cookieStore);
    cookieStore.setFromHeader(refreshed.setCartCookie);
    applyShippingEstimate(cookieStore, {
      districtCode: 'q1',
      districtName: 'Quận 1',
      method: 'standard',
      provinceCode: 'hcm',
      provinceName: 'TP. Hồ Chí Minh',
    });

    const first = submitCheckout(cookieStore, 'attempt-1', {
      acceptedTerms: true,
      address: {
        districtCode: 'q1',
        districtName: 'Quận 1',
        email: 'guest@example.com',
        fullName: 'Nguyễn Minh',
        phone: '0901234567',
        provinceCode: 'hcm',
        provinceName: 'TP. Hồ Chí Minh',
        streetAddress: '12 Nguyễn Huệ',
        wardCode: 'bn',
        wardName: 'Bến Nghé',
      },
      contact: {
        email: 'guest@example.com',
        fullName: 'Nguyễn Minh',
        phone: '0901234567',
      },
      deliveryNote: '',
      paymentMethod: 'cod',
      shippingMethod: 'standard',
    });
    const second = submitCheckout(cookieStore, 'attempt-1', {
      acceptedTerms: true,
      address: {
        districtCode: 'q1',
        districtName: 'Quận 1',
        email: 'guest@example.com',
        fullName: 'Nguyễn Minh',
        phone: '0901234567',
        provinceCode: 'hcm',
        provinceName: 'TP. Hồ Chí Minh',
        streetAddress: '12 Nguyễn Huệ',
        wardCode: 'bn',
        wardName: 'Bến Nghé',
      },
      contact: {
        email: 'guest@example.com',
        fullName: 'Nguyễn Minh',
        phone: '0901234567',
      },
      deliveryNote: '',
      paymentMethod: 'cod',
      shippingMethod: 'standard',
    });

    expect(first.checkout.order.code).toBe(second.checkout.order.code);
  });
});
