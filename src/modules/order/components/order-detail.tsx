import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import type { PublicOrder } from '@/modules/order/contracts/order';
import { buildOrderTimeline } from '@/modules/order/utils/order-timeline';
import { formatDate } from '@/lib/utils/format';

export function OrderDetail({ order }: { order: PublicOrder }) {
  const timeline = buildOrderTimeline(order);
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2">
        <Badge>{order.orderStatus}</Badge>
        <Badge>{order.paymentStatus}</Badge>
        <Badge>{order.fulfillmentStatus}</Badge>
      </div>
      <p>Ngày đặt: {formatDate(order.createdAt)}</p>
      <section>
        <h2 className="font-display mb-4 text-2xl">Tiến trình</h2>
        <ol className="grid gap-3" aria-label="Tiến trình đơn hàng">
          {timeline.map((step) => (
            <li className="flex items-center gap-3" key={step.label}>
              <span
                aria-hidden="true"
                className={`size-3 rounded-full ${step.complete ? 'bg-success' : 'bg-surface-muted border-border border'}`}
              />
              <span>
                {step.label}
                {!step.complete && (
                  <span className="sr-only"> — chưa hoàn thành</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="font-display mb-4 text-2xl">Sản phẩm</h2>
        <ul className="divide-border divide-y">
          {order.lines.map((line) => (
            <li
              className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]"
              key={line.lineId}
            >
              <div>
                <strong>{line.productName}</strong>
                <p className="text-text-muted">
                  {line.selectedColor} · {line.selectedSize} · Số lượng{' '}
                  {line.quantity}
                </p>
              </div>
              <Price
                amount={line.lineTotal}
                label={`Thành tiền ${line.productName}`}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="border-border grid gap-2 border p-5">
        <h2 className="font-display text-2xl">Tổng cộng</h2>
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <Price amount={order.subtotal} />
        </div>
        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <Price amount={order.shippingAmount} />
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Tổng thanh toán</span>
          <Price amount={order.total} />
        </div>
      </section>
      <section>
        <h2 className="font-display mb-2 text-2xl">Giao hàng</h2>
        <address className="text-text-muted not-italic">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.streetAddress},{' '}
          {order.shippingAddress.wardName}, {order.shippingAddress.districtName}
          , {order.shippingAddress.provinceName}
        </address>
      </section>
    </div>
  );
}
