'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Toast } from '@/components/ui/toast';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import {
  type CartResponse,
  applyCartPromotion,
  dispatchCartUpdated,
  estimateShipping,
  moveCartLineToWishlist,
  removeCartLine,
  removeCartPromotion,
  updateCartLine,
} from '@/modules/cart/api/cart-client';
import { CartLineItem } from '@/modules/cart/components/cart-line-item';
import { CartSummaryCard } from '@/modules/cart/components/cart-summary-card';
import type { Cart } from '@/modules/cart/contracts/cart';

export function CartPageClient({
  initialCart,
  initialFreeShippingProgress,
}: {
  initialCart: Cart;
  initialFreeShippingProgress: CartResponse['freeShippingProgress'];
}) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const [freeShippingProgress, setFreeShippingProgress] = useState(
    initialFreeShippingProgress,
  );
  const [promotionCode, setPromotionCode] = useState('');
  const [toast, setToast] = useState<string>();
  const [error, setError] = useState<string>();
  const [isPromotionPending, setIsPromotionPending] = useState(false);
  const [isShippingPending, setIsShippingPending] = useState(false);

  const lineCount = useMemo(
    () => cart.lines.reduce((total, line) => total + line.quantity, 0),
    [cart.lines],
  );

  useEffect(() => {
    noStorefrontAnalytics({
      name: 'view_cart',
      properties: { lineCount },
    });
  }, [lineCount]);

  function syncCart(data: CartResponse) {
    setCart(data.cart);
    setFreeShippingProgress(data.freeShippingProgress);
    dispatchCartUpdated({ source: 'drawer' });
  }

  async function handleQuantityChange(lineId: string, quantity: number) {
    const response = await updateCartLine(lineId, quantity);
    if (response.error || !response.data) {
      setError('Không thể cập nhật số lượng.');
      return;
    }
    syncCart(response.data);
    noStorefrontAnalytics({
      name: 'update_cart_quantity',
      properties: { lineId, quantity },
    });
  }

  async function handleRemove(lineId: string) {
    const response = await removeCartLine(lineId);
    if (response.error || !response.data) {
      setError('Không thể xóa sản phẩm.');
      return;
    }
    syncCart(response.data);
    setToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    noStorefrontAnalytics({ name: 'remove_from_cart', properties: { lineId } });
  }

  async function handleMoveToWishlist(lineId: string) {
    const response = await moveCartLineToWishlist(lineId);
    if (response.error || !response.data) {
      setError('Chưa thể chuyển sản phẩm sang yêu thích.');
      return;
    }
    syncCart(response.data);
    setToast('Đã chuyển sản phẩm sang danh sách yêu thích.');
  }

  async function handleApplyPromotion() {
    if (!promotionCode.trim()) return;
    setIsPromotionPending(true);
    const response = await applyCartPromotion(promotionCode);
    setIsPromotionPending(false);
    if (response.error || !response.data) {
      setError('Không thể áp dụng mã khuyến mãi.');
      return;
    }
    syncCart(response.data);
    setToast(response.data.promotionResult?.message);
    noStorefrontAnalytics({
      name: 'apply_promotion',
      properties: { code: promotionCode.toUpperCase() },
    });
  }

  async function handleRemovePromotion(code: string) {
    const response = await removeCartPromotion(code);
    if (response.error || !response.data) {
      setError('Không thể gỡ mã khuyến mãi.');
      return;
    }
    syncCart(response.data);
    noStorefrontAnalytics({
      name: 'remove_promotion',
      properties: { code },
    });
  }

  async function handleEstimateShipping() {
    setIsShippingPending(true);
    const response = await estimateShipping({
      districtCode: 'q1',
      districtName: 'Quận 1',
      method: 'standard',
      provinceCode: 'hcm',
      provinceName: 'TP. Hồ Chí Minh',
    });
    setIsShippingPending(false);
    if (response.error || !response.data) {
      setError('Không thể tính phí giao hàng.');
      return;
    }
    syncCart(response.data);
    setToast('Đã cập nhật ước tính giao hàng cho khu vực nội bộ.');
  }

  if (lineCount === 0) {
    return (
      <EmptyState
        action={<Link href="/shop">Tiếp tục mua sắm</Link>}
        description="Hãy thêm sản phẩm hoặc set để chuẩn bị đơn hàng."
        title="Giỏ hàng của bạn đang trống"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-6">
        <header className="grid gap-2">
          <p className="text-text-subtle text-sm tracking-[0.18em] uppercase">
            Giỏ hàng
          </p>
          <h1 className="font-display text-3xl">Đang có {lineCount} mục</h1>
        </header>
        {toast ? <Toast title={toast} /> : null}
        {error ? <ErrorState description={error} /> : null}
        <div className="grid gap-5">
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
        <section className="border-border-subtle grid gap-4 border p-5">
          <h2 className="font-display text-xl">Khuyến mãi và giao hàng</h2>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              aria-label="Mã khuyến mãi"
              onChange={(event) => setPromotionCode(event.target.value)}
              placeholder="DEV10 hoặc DEVSHIP"
              value={promotionCode}
            />
            <Button
              isLoading={isPromotionPending}
              onClick={() => void handleApplyPromotion()}
              variant="secondary"
            >
              Áp dụng mã
            </Button>
          </div>
          {cart.promotionCodes.length > 0 ? (
            <ul className="grid gap-2 text-sm">
              {cart.promotionCodes.map((promotion) => (
                <li
                  className="flex flex-wrap items-center gap-3"
                  key={promotion.code}
                >
                  <span>{promotion.code}</span>
                  <button
                    className="underline-offset-4 hover:underline"
                    onClick={() => void handleRemovePromotion(promotion.code)}
                    type="button"
                  >
                    Gỡ mã
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <Button
            isLoading={isShippingPending}
            onClick={() => void handleEstimateShipping()}
            variant="secondary"
          >
            Cập nhật ước tính giao hàng nội bộ
          </Button>
        </section>
      </div>
      <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
        <CartSummaryCard
          cart={cart}
          freeShippingProgress={freeShippingProgress}
        />
        <Button
          className="w-full"
          onClick={() => {
            noStorefrontAnalytics({
              name: 'begin_checkout',
              properties: { lineCount },
            });
            router.push('/checkout');
          }}
        >
          Tiếp tục thanh toán
        </Button>
      </aside>
    </div>
  );
}
