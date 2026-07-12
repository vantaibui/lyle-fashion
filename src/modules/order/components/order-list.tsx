import Link from 'next/link';
import { EmptyState } from '@/components/commerce/empty-state';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import type { PublicOrder } from '@/modules/order/contracts/order';
import { formatDate } from '@/lib/utils/format';

export function OrderList({ orders }: { orders: PublicOrder[] }) {
  if (orders.length === 0)
    return (
      <EmptyState
        description="Đơn hàng sẽ xuất hiện tại đây sau khi được tạo."
        title="Chưa có đơn hàng"
      />
    );
  return (
    <ul className="grid gap-4">
      {orders.map((order) => (
        <li
          className="border-border grid gap-4 border p-5 md:grid-cols-[1fr_auto]"
          key={order.code}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <strong translate="no">{order.code}</strong>
              <Badge>{order.orderStatus}</Badge>
              <Badge>{order.paymentStatus}</Badge>
              <Badge>{order.fulfillmentStatus}</Badge>
            </div>
            <p className="text-text-muted mt-2">
              {formatDate(order.createdAt)} · {order.lines.length} sản phẩm
            </p>
            <p className="mt-2 line-clamp-1">{order.lines[0]?.productName}</p>
          </div>
          <div className="grid content-between justify-items-start gap-3 md:justify-items-end">
            <Price amount={order.total} label="Tổng đơn" />
            <Link
              className="min-h-11 py-2 underline underline-offset-4"
              href={`/account/orders/${encodeURIComponent(order.code)}`}
            >
              Xem chi tiết
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
