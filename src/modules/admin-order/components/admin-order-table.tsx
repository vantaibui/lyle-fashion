import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link';
import { formatVnd } from '@/lib/utils/format';
import type { AdminOrderListItem } from '@/modules/admin-order/contracts/admin-order';
import {
  fulfillmentStatusLabel,
  fulfillmentStatusTone,
  orderStatusLabel,
  orderStatusTone,
  paymentStatusLabel,
  paymentStatusTone,
} from '@/modules/admin-order/utils/order-status-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function AdminOrderTable({ items }: { items: AdminOrderListItem[] }) {
  return (
    <div className="border-border-subtle overflow-x-auto rounded-xs border">
      <table className="w-full min-w-6xl border-collapse text-sm">
        <caption className="sr-only">Danh sách đơn hàng</caption>
        <thead>
          <tr className="border-border-subtle bg-surface-muted border-b text-left">
            <th className="px-4 py-3 font-semibold" scope="col">
              Mã đơn hàng
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Khách hàng
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Trạng thái đơn
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Thanh toán
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Giao vận
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Tổng tiền
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Ngày tạo
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-border-subtle divide-y">
          {items.map((order) => (
            <tr key={order.id}>
              <th
                className="px-4 py-3 font-medium whitespace-nowrap"
                scope="row"
              >
                {order.code}
              </th>
              <td className="px-4 py-3">{order.customerSummary}</td>
              <td className="px-4 py-3">
                <Badge tone={orderStatusTone(order.orderStatus)}>
                  {orderStatusLabel(order.orderStatus)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={paymentStatusTone(order.paymentStatus)}>
                  {paymentStatusLabel(order.paymentStatus)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={fulfillmentStatusTone(order.fulfillmentStatus)}>
                  {fulfillmentStatusLabel(order.fulfillmentStatus)}
                </Badge>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {formatVnd(order.total)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatAdminTimestamp(order.createdAt)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link href={`/admin/orders/${order.id}`} variant="subtle">
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
