import Image from 'next/image';

import { Link } from '@/components/ui/link';
import { Price } from '@/components/ui/price';
import type { PublicOrder } from '@/modules/order/contracts/order';

export function OrderSuccessSummary({ order }: { order: PublicOrder }) {
  return (
    <div className="grid gap-8">
      <header className="grid gap-3">
        <p className="text-text-subtle text-sm tracking-[0.18em] uppercase">
          Đặt hàng thành công
        </p>
        <h1 className="font-display text-3xl">Mã đơn {order.code}</h1>
        <p className="text-text-muted">
          Trạng thái thanh toán hiện tại: {order.paymentStatus}. Bạn có thể lưu
          mã đơn này để theo dõi ở giai đoạn kế tiếp.
        </p>
      </header>
      <section className="grid gap-4">
        {order.lines.map((line) => (
          <article
            className="border-border-subtle grid gap-4 border-b pb-5 sm:grid-cols-[6rem_minmax(0,1fr)]"
            key={line.lineId}
          >
            <div className="bg-surface-muted relative aspect-[4/5] overflow-hidden">
              <Image
                alt={line.imageAlt}
                className="object-cover"
                fill
                sizes="96px"
                src={line.imageSrc}
              />
            </div>
            <div className="grid gap-2">
              <h2 className="font-medium">{line.productName}</h2>
              <p className="text-text-muted text-sm">
                {line.selectedColor ? `Màu ${line.selectedColor} · ` : ''}
                {line.selectedSize ? `Cỡ ${line.selectedSize} · ` : ''}
                SL {line.quantity}
              </p>
              <Price amount={line.lineTotal} />
            </div>
          </article>
        ))}
      </section>
      <section className="border-border-subtle grid gap-3 border p-5 text-sm">
        <p>
          Người nhận: {order.shippingAddress.fullName} ·{' '}
          {order.shippingAddress.phone}
        </p>
        <p>
          Địa chỉ: {order.shippingAddress.streetAddress},{' '}
          {order.shippingAddress.wardName}, {order.shippingAddress.districtName}
          , {order.shippingAddress.provinceName}
        </p>
        <p>
          Tổng cộng: <Price amount={order.total} />
        </p>
      </section>
      <div className="flex flex-wrap gap-4">
        <Link href="/order-tracking">Đi đến trang theo dõi đơn hàng</Link>
        <Link href="/shop">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}
