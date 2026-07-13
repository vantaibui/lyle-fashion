'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionLink } from '@/components/layout/header/action-link';
import { DesktopNavigation } from '@/components/layout/header/desktop-navigation';
import {
  AccountIcon,
  HeartIcon,
  SearchIcon,
} from '@/components/layout/header/icons';
import { MobileNavigation } from '@/components/layout/header/mobile-navigation';
import { IconButton } from '@/components/ui/icon-button';
import type { NavigationGroup } from '@/config/navigation';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import {
  cartUpdatedEventName,
  type CartResponse,
  getCart,
} from '@/modules/cart/api/cart-client';
import { CartTriggerButton } from '@/modules/cart/components/cart-trigger-button';

const SearchOverlay = dynamic(
  () =>
    import('@/modules/search/components/search-overlay').then((module) => ({
      default: module.SearchOverlay,
    })),
  { loading: () => null },
);

const CartDrawer = dynamic(
  () =>
    import('@/modules/cart/components/cart-drawer').then((module) => ({
      default: module.CartDrawer,
    })),
  { loading: () => null },
);

type HeaderInteractiveProps = {
  groups: NavigationGroup[];
  wishlistCount?: number;
};

function emptyCartSnapshot(): CartResponse {
  return {
    cart: {
      currency: 'VND',
      expiresAt: '',
      id: 'client-pending',
      lines: [],
      promotionCodes: [],
      status: 'active',
      totals: {
        discountTotal: 0,
        grandTotal: 0,
        shippingEstimate: 0,
        subtotal: 0,
        taxTotal: 0,
      },
      validationMessages: [],
      version: 0,
    },
    freeShippingProgress: {
      current: 0,
      remaining: 1_200_000,
      threshold: 1_200_000,
    },
    requestId: 'client-pending',
  };
}

export function HeaderInteractive({
  groups,
  wishlistCount,
}: HeaderInteractiveProps) {
  const pathname = usePathname();
  // On the cart and checkout pages the drawer would overlay a dedicated cart
  // surface, so the icon links to the full cart page instead of opening the
  // drawer. Everywhere else the icon opens the drawer.
  const isCartSurface = pathname === '/cart' || pathname === '/checkout';
  const [cartState, setCartState] = useState<CartResponse>(emptyCartSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const cartCount = useMemo(
    () =>
      cartState.cart.lines.reduce((total, line) => total + line.quantity, 0),
    [cartState.cart.lines],
  );

  useEffect(() => {
    let mounted = true;

    async function refreshCart() {
      const response = await getCart();
      if (!mounted || !response.data) return;
      setCartState(response.data);
    }

    async function handleCartUpdated(event: Event) {
      const detail = (
        event as CustomEvent<{
          openDrawer?: boolean;
        }>
      ).detail;
      await refreshCart();
      if (detail?.openDrawer) {
        setIsCartOpen(true);
      }
    }

    void refreshCart();
    window.addEventListener(cartUpdatedEventName, handleCartUpdated);
    return () => {
      mounted = false;
      window.removeEventListener(cartUpdatedEventName, handleCartUpdated);
    };
  }, []);

  function closeSearch() {
    setIsSearchOpen(false);
    requestAnimationFrame(() => searchTriggerRef.current?.focus());
  }

  return (
    <>
      <div className="hidden items-center gap-1 xl:flex">
        <DesktopNavigation groups={groups} />
        <Link
          className="text-brand-sale hover:bg-sale-surface flex min-h-11 items-center px-4 text-sm font-semibold tracking-wide uppercase transition-colors duration-[var(--duration-fast)]"
          href="/collections/sale"
        >
          Sale 50%
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <MobileNavigation groups={groups} />
        <IconButton
          label="Mở tìm kiếm"
          onClick={() => {
            setIsSearchOpen(true);
            noStorefrontAnalytics({ name: 'search_open' });
          }}
          ref={searchTriggerRef}
        >
          <SearchIcon />
        </IconButton>
        <span className="hidden xl:contents">
          <ActionLink href="/account" label="Tài khoản">
            <AccountIcon />
          </ActionLink>
          <ActionLink
            count={wishlistCount}
            href="/wishlist"
            label="Danh sách yêu thích"
          >
            <HeartIcon />
          </ActionLink>
        </span>
        {isCartSurface ? (
          <CartTriggerButton count={cartCount} href="/cart" label="Giỏ hàng" />
        ) : (
          <CartTriggerButton
            count={cartCount}
            label="Giỏ hàng"
            onClick={() => setIsCartOpen(true)}
          />
        )}
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
      {!isCartSurface && (
        <CartDrawer
          initialCart={cartState.cart}
          initialFreeShippingProgress={cartState.freeShippingProgress}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
}
