import type { ApiError } from '@/lib/api/error';
import type { PaginatedData } from '@/lib/api/pagination';
import type { PaymentMethodType } from '@/modules/payment/contracts/payment';

/**
 * Order/payment/fulfillment status enums follow the proposed state machine
 * in docs/STATUS-TRANSITIONS.md, which is broader than the Phase 11
 * storefront-local contract (src/modules/order/contracts/order.ts). Admin
 * operators need the fuller documented set even though it remains DRAFT
 * and pending backend approval; this is not a claim of production truth.
 */
export const adminOrderStatuses = [
  'DRAFT',
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
] as const;
export type AdminOrderStatus = (typeof adminOrderStatuses)[number];

export const adminPaymentStatuses = [
  'NOT_REQUIRED',
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'EXPIRED',
  'VOIDED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
] as const;
export type AdminPaymentStatus = (typeof adminPaymentStatuses)[number];

export const adminFulfillmentStatuses = [
  'UNFULFILLED',
  'PROCESSING',
  'PARTIALLY_FULFILLED',
  'SHIPPED',
  'DELIVERED',
  'DELIVERY_FAILED',
  'RETURN_TO_SENDER',
] as const;
export type AdminFulfillmentStatus = (typeof adminFulfillmentStatuses)[number];

/**
 * List-row projection. Deliberately excludes full shipping address and
 * contact PII per "do not expose unnecessary PII in list views" — only a
 * masked customer summary is shown. Full detail requires a separate
 * ownership-checked detail read (future phase).
 */
export type AdminOrderListItem = {
  code: string;
  createdAt: string;
  currency: 'VND';
  customerSummary: string;
  deliveryMethod: string;
  fulfillmentStatus: AdminFulfillmentStatus;
  id: string;
  orderStatus: AdminOrderStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: AdminPaymentStatus;
  total: number;
};

export type AdminOrderQuery = {
  fulfillmentStatus?: AdminFulfillmentStatus;
  orderStatus?: AdminOrderStatus;
  page: number;
  pageSize: number;
  paymentStatus?: AdminPaymentStatus;
  q?: string;
};

export type AdminOrderListResult = PaginatedData<AdminOrderListItem>;

export type AdminOrderListProvider = (
  query: AdminOrderQuery,
  options: { signal?: AbortSignal },
) => Promise<
  { data: AdminOrderListResult; error: null } | { data: null; error: ApiError }
>;

/**
 * Read-only detail projection for this phase. Order actions (confirm,
 * cancel, fulfill, refund) are explicitly out of scope until documented
 * status-transition guards (docs/STATUS-TRANSITIONS.md) are backend-approved.
 */
export type AdminOrderDetail = AdminOrderListItem;

export type AdminOrderDetailProvider = (
  orderId: string,
  options: { signal?: AbortSignal },
) => Promise<
  | { data: AdminOrderDetail | null; error: null }
  | { data: null; error: ApiError }
>;
