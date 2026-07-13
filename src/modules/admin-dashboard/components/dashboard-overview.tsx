import { EmptyState } from '@/components/commerce/empty-state';
import type { DashboardSnapshot } from '@/modules/admin-dashboard/contracts/dashboard';
import {
  DashboardCard,
  DashboardStat,
} from '@/modules/admin-dashboard/components/dashboard-card';
import { auditActionLabel } from '@/modules/admin-auth/utils/audit-action-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function DashboardOverview({
  snapshot,
}: {
  snapshot: DashboardSnapshot;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Đơn hàng">
          <DashboardStat
            label="Chờ xác nhận"
            value={snapshot.orders.pendingConfirmationCount}
          />
          <DashboardStat
            label="Chờ xử lý giao hàng"
            value={snapshot.orders.awaitingFulfillmentCount}
          />
          <DashboardStat
            label="Đã hủy hôm nay"
            value={snapshot.orders.cancelledTodayCount}
          />
        </DashboardCard>
        <DashboardCard title="Cảnh báo tồn kho">
          <DashboardStat
            label="SKU sắp hết hàng"
            value={snapshot.inventoryAlerts.lowStockSkuCount}
          />
          <DashboardStat
            label="SKU hết hàng"
            value={snapshot.inventoryAlerts.outOfStockSkuCount}
          />
        </DashboardCard>
        <DashboardCard title="Trạng thái sản phẩm">
          <DashboardStat
            label="Đã xuất bản"
            value={snapshot.productStatus.publishedCount}
          />
          <DashboardStat
            label="Bản nháp"
            value={snapshot.productStatus.draftCount}
          />
          <DashboardStat
            label="Đã lưu trữ"
            value={snapshot.productStatus.archivedCount}
          />
        </DashboardCard>
        <DashboardCard title="Hàng đợi xử lý">
          <DashboardStat
            label="Đang xử lý"
            value={snapshot.fulfillmentQueue.processingCount}
          />
          <DashboardStat
            label="Đã giao vận hôm nay"
            value={snapshot.fulfillmentQueue.shippedTodayCount}
          />
        </DashboardCard>
        <DashboardCard title="Yêu cầu đổi trả">
          <DashboardStat
            label="Đang xem xét"
            value={snapshot.returns.underReviewCount}
          />
          <DashboardStat
            label="Chờ kiểm tra hàng"
            value={snapshot.returns.awaitingInspectionCount}
          />
        </DashboardCard>
        <DashboardCard title="Khuyến mãi">
          <DashboardStat
            label="Đang hoạt động"
            value={snapshot.promotions.activeCount}
          />
          <DashboardStat
            label="Đã lên lịch"
            value={snapshot.promotions.scheduledCount}
          />
        </DashboardCard>
      </div>
      <DashboardCard title="Hoạt động gần đây">
        {snapshot.recentAuditEvents.length === 0 ? (
          <EmptyState
            description="Hoạt động quản trị sẽ xuất hiện tại đây sau khi có thao tác được ghi nhận."
            title="Chưa có hoạt động"
          />
        ) : (
          <ul className="divide-border-subtle divide-y" role="list">
            {snapshot.recentAuditEvents.map((event) => (
              <li
                className="grid gap-1 py-3 first:pt-0 last:pb-0"
                key={event.eventId}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">
                    {auditActionLabel(event.action)}
                  </span>
                  <time
                    className="text-text-subtle text-xs"
                    dateTime={event.timestamp}
                  >
                    {formatAdminTimestamp(event.timestamp)}
                  </time>
                </div>
                <p className="text-text-muted text-sm">{event.safeSummary}</p>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
