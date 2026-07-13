import 'server-only';

import type { DashboardSnapshotProvider } from '@/modules/admin-dashboard/contracts/dashboard';
import { getAuditLog } from '@/modules/admin-auth/server/admin-audit-store';

/**
 * Development fixture only. Every count is zero because no OMS/WMS/
 * promotion backend is connected yet; this deliberately avoids fabricating
 * production-looking metrics. Recent audit events are real, sourced from
 * the in-memory audit store, so the panel is not entirely inert.
 */
export const mockDashboardAdapter: DashboardSnapshotProvider = async () => {
  const auditLog = getAuditLog({ page: 1, pageSize: 5 });
  return {
    data: {
      fulfillmentQueue: { processingCount: 0, shippedTodayCount: 0 },
      inventoryAlerts: { lowStockSkuCount: 0, outOfStockSkuCount: 0 },
      orders: {
        awaitingFulfillmentCount: 0,
        cancelledTodayCount: 0,
        pendingConfirmationCount: 0,
      },
      productStatus: { archivedCount: 0, draftCount: 0, publishedCount: 0 },
      promotions: { activeCount: 0, scheduledCount: 0 },
      recentAuditEvents: auditLog.items.map((entry) => ({
        action: entry.action,
        actorRole: entry.actorRole,
        eventId: entry.eventId,
        safeSummary: entry.safeSummary,
        timestamp: entry.timestamp,
      })),
      returns: { awaitingInspectionCount: 0, underReviewCount: 0 },
    },
    error: null,
  };
};
