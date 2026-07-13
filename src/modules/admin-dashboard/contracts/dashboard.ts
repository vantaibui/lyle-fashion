import type { ApiError } from '@/lib/api/error';
import type { AuditLogAction } from '@/modules/admin-auth/contracts/audit-log';

export type OrderSummary = {
  awaitingFulfillmentCount: number;
  cancelledTodayCount: number;
  pendingConfirmationCount: number;
};

export type InventoryAlertSummary = {
  lowStockSkuCount: number;
  outOfStockSkuCount: number;
};

export type ProductStatusSummary = {
  archivedCount: number;
  draftCount: number;
  publishedCount: number;
};

export type FulfillmentQueueSummary = {
  processingCount: number;
  shippedTodayCount: number;
};

export type ReturnRequestSummary = {
  awaitingInspectionCount: number;
  underReviewCount: number;
};

export type PromotionStatusSummary = {
  activeCount: number;
  scheduledCount: number;
};

export type RecentAuditEventSummary = {
  action: AuditLogAction;
  actorRole: string;
  eventId: string;
  safeSummary: string;
  timestamp: string;
};

export type DashboardSnapshot = {
  fulfillmentQueue: FulfillmentQueueSummary;
  inventoryAlerts: InventoryAlertSummary;
  orders: OrderSummary;
  productStatus: ProductStatusSummary;
  promotions: PromotionStatusSummary;
  recentAuditEvents: RecentAuditEventSummary[];
  returns: ReturnRequestSummary;
};

/**
 * Typed provider boundary. The mock adapter (api/mock-dashboard-adapter.ts)
 * is a development fixture only; production must implement this same type
 * against approved OMS/WMS/promotion/audit backends.
 */
export type DashboardSnapshotProvider = (options: {
  signal?: AbortSignal;
}) => Promise<
  { data: DashboardSnapshot; error: null } | { data: null; error: ApiError }
>;
