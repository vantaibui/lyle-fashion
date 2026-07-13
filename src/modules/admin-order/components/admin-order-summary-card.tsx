import { Badge } from '@/components/ui/badge';
import { formatVnd } from '@/lib/utils/format';
import type { AdminOrderDetail } from '@/modules/admin-order/contracts/admin-order';
import {
  fulfillmentStatusLabel,
  fulfillmentStatusTone,
  orderStatusLabel,
  orderStatusTone,
  paymentStatusLabel,
  paymentStatusTone,
} from '@/modules/admin-order/utils/order-status-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function AdminOrderSummaryCard({ order }: { order: AdminOrderDetail }) {
  return (
    <div className="border-border-subtle bg-surface grid gap-4 rounded-xs border p-5">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-text-muted text-sm">Khách hàng</dt>
          <dd className="mt-1">{order.customerSummary}</dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Ngày tạo</dt>
          <dd className="mt-1">{formatAdminTimestamp(order.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Phương thức giao hàng</dt>
          <dd className="mt-1">{order.deliveryMethod}</dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Tổng tiền</dt>
          <dd className="mt-1 tabular-nums">{formatVnd(order.total)}</dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Trạng thái đơn hàng</dt>
          <dd className="mt-1">
            <Badge tone={orderStatusTone(order.orderStatus)}>
              {orderStatusLabel(order.orderStatus)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Trạng thái thanh toán</dt>
          <dd className="mt-1">
            <Badge tone={paymentStatusTone(order.paymentStatus)}>
              {paymentStatusLabel(order.paymentStatus)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted text-sm">Trạng thái giao vận</dt>
          <dd className="mt-1">
            <Badge tone={fulfillmentStatusTone(order.fulfillmentStatus)}>
              {fulfillmentStatusLabel(order.fulfillmentStatus)}
            </Badge>
          </dd>
        </div>
      </dl>
      <p className="text-text-subtle text-sm">
        Thao tác xử lý đơn hàng (xác nhận, hủy, giao vận, hoàn tiền) chưa được
        triển khai trong giai đoạn này.
      </p>
    </div>
  );
}
