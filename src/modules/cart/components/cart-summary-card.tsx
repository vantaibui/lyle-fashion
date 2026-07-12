import { Price } from '@/components/ui/price';
import { ProgressBar } from '@/modules/cart/components/progress-bar';
import type { Cart } from '@/modules/cart/contracts/cart';
import type { FreeShippingProgress } from '@/modules/cart/api/cart-client';

export function CartSummaryCard({
  cart,
  freeShippingProgress,
  title = 'Tóm tắt đơn hàng',
}: {
  cart: Cart;
  freeShippingProgress: FreeShippingProgress;
  title?: string;
}) {
  return (
    <section className="border-border-subtle bg-surface grid gap-5 border p-5">
      <div className="grid gap-2">
        <h2 className="font-display text-xl">{title}</h2>
        <ProgressBar
          current={freeShippingProgress.current}
          label={
            freeShippingProgress.remaining > 0
              ? `Mua thêm ${freeShippingProgress.remaining.toLocaleString('vi-VN')}đ để được miễn phí vận chuyển`
              : 'Đơn hàng đã đạt ngưỡng miễn phí vận chuyển'
          }
          max={freeShippingProgress.threshold}
        />
      </div>
      <dl className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-muted">Tạm tính</dt>
          <dd>
            <Price amount={cart.totals.subtotal} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-muted">Giảm giá</dt>
          <dd>
            <Price amount={cart.totals.discountTotal} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-text-muted">Phí giao hàng</dt>
          <dd>
            <Price amount={cart.totals.shippingEstimate} />
          </dd>
        </div>
        <div className="border-border-subtle flex items-center justify-between gap-4 border-t pt-3 text-base font-medium">
          <dt>Tổng cộng</dt>
          <dd>
            <Price amount={cart.totals.grandTotal} />
          </dd>
        </div>
      </dl>
      {cart.promotionCodes.length > 0 ? (
        <ul className="text-text-muted grid gap-2 text-sm">
          {cart.promotionCodes.map((promotion) => (
            <li key={promotion.code}>
              {promotion.code}: {promotion.description}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
