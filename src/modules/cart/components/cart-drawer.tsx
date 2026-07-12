'use client';

import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Drawer } from '@/components/ui/drawer';
import { Link } from '@/components/ui/link';
import { Toast } from '@/components/ui/toast';
import {
  type CartResponse,
  cartUpdatedEventName,
  dispatchCartUpdated,
  getCart,
  moveCartLineToWishlist,
  removeCartLine,
  updateCartLine,
} from '@/modules/cart/api/cart-client';
import { CartLineItem } from '@/modules/cart/components/cart-line-item';
import { CartSummaryCard } from '@/modules/cart/components/cart-summary-card';
import type { Cart } from '@/modules/cart/contracts/cart';

type CartDrawerProps = {
  initialCart: Cart;
  initialFreeShippingProgress: CartResponse['freeShippingProgress'];
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({
  initialCart,
  initialFreeShippingProgress,
  isOpen,
  onClose,
}: CartDrawerProps) {
  const [cart, setCart] = useState(initialCart);
  const [freeShippingProgress, setFreeShippingProgress] = useState(
    initialFreeShippingProgress,
  );
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string>();

  async function refreshCart() {
    setIsLoading(true);
    const response = await getCart();
    setIsLoading(false);
    if (response.error || !response.data) {
      setError('Chưa thể đồng bộ giỏ hàng. Vui lòng thử lại.');
      return;
    }

    setCart(response.data.cart);
    setFreeShippingProgress(response.data.freeShippingProgress);
    setError(undefined);
  }

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      void refreshCart();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    function handleCartUpdated(event: Event) {
      const detail = (event as CustomEvent<{ openDrawer?: boolean }>).detail;
      void refreshCart();
      if (detail?.openDrawer) {
        setToast('Giỏ hàng đã được cập nhật.');
      }
    }

    window.addEventListener(cartUpdatedEventName, handleCartUpdated);
    return () =>
      window.removeEventListener(cartUpdatedEventName, handleCartUpdated);
  }, []);

  const lineCount = useMemo(
    () => cart.lines.reduce((total, line) => total + line.quantity, 0),
    [cart.lines],
  );

  async function handleQuantityChange(lineId: string, quantity: number) {
    const response = await updateCartLine(lineId, quantity);
    if (response.error || !response.data) {
      setError('Không thể cập nhật số lượng.');
      return;
    }

    setCart(response.data.cart);
    setFreeShippingProgress(response.data.freeShippingProgress);
    dispatchCartUpdated({ source: 'drawer' });
  }

  async function handleRemove(lineId: string) {
    const response = await removeCartLine(lineId);
    if (response.error || !response.data) {
      setError('Không thể xóa dòng giỏ hàng.');
      return;
    }

    setCart(response.data.cart);
    setFreeShippingProgress(response.data.freeShippingProgress);
    setToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    dispatchCartUpdated({ source: 'drawer' });
  }

  async function handleMoveToWishlist(lineId: string) {
    const response = await moveCartLineToWishlist(lineId);
    if (response.error || !response.data) {
      setError('Chưa thể chuyển sản phẩm sang yêu thích.');
      return;
    }

    setCart(response.data.cart);
    setFreeShippingProgress(response.data.freeShippingProgress);
    setToast('Đã chuyển sản phẩm sang danh sách yêu thích.');
    dispatchCartUpdated({ source: 'drawer' });
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Giỏ hàng · ${lineCount}`}>
      <div className="grid gap-5">
        {toast ? <Toast title={toast} /> : null}
        {error ? (
          <ErrorState
            action={
              <button
                className="underline-offset-4 hover:underline"
                onClick={() => void refreshCart()}
                type="button"
              >
                Thử lại
              </button>
            }
            description={error}
          />
        ) : null}
        {cart.lines.length === 0 ? (
          <EmptyState
            action={<Link href="/shop">Tiếp tục mua sắm</Link>}
            description="Thêm sản phẩm hoặc set để bắt đầu chuẩn bị đơn hàng."
            title="Giỏ hàng đang trống"
          />
        ) : (
          <>
            <div aria-live="polite" className="grid gap-5">
              {cart.lines.map((line) => (
                <CartLineItem
                  key={line.lineId}
                  line={line}
                  onMoveToWishlist={handleMoveToWishlist}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
            <CartSummaryCard
              cart={cart}
              freeShippingProgress={freeShippingProgress}
              title={isLoading ? 'Đang đồng bộ giỏ hàng…' : 'Tóm tắt'}
            />
            <div className="grid gap-3">
              <Link href="/cart">Xem giỏ hàng</Link>
              <Link href="/checkout">Tiến hành thanh toán</Link>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
