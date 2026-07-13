import type {
  AdminFulfillmentStatus,
  AdminOrderStatus,
  AdminPaymentStatus,
} from '@/modules/admin-order/contracts/admin-order';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const orderStatusLabels: Readonly<Record<AdminOrderStatus, string>> = {
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn tất',
  CONFIRMED: 'Đã xác nhận',
  DRAFT: 'Nháp',
  PENDING_CONFIRMATION: 'Chờ xác nhận',
};

const orderStatusTones: Readonly<Record<AdminOrderStatus, Tone>> = {
  CANCELLED: 'danger',
  COMPLETED: 'success',
  CONFIRMED: 'info',
  DRAFT: 'neutral',
  PENDING_CONFIRMATION: 'warning',
};

const paymentStatusLabels: Readonly<Record<AdminPaymentStatus, string>> = {
  AUTHORIZED: 'Đã ủy quyền',
  CAPTURED: 'Đã thanh toán',
  EXPIRED: 'Hết hạn',
  FAILED: 'Thất bại',
  NOT_REQUIRED: 'Không yêu cầu',
  PARTIALLY_REFUNDED: 'Hoàn tiền một phần',
  PENDING: 'Chờ thanh toán',
  REFUNDED: 'Đã hoàn tiền',
  VOIDED: 'Đã hủy ủy quyền',
};

const paymentStatusTones: Readonly<Record<AdminPaymentStatus, Tone>> = {
  AUTHORIZED: 'info',
  CAPTURED: 'success',
  EXPIRED: 'neutral',
  FAILED: 'danger',
  NOT_REQUIRED: 'neutral',
  PARTIALLY_REFUNDED: 'warning',
  PENDING: 'warning',
  REFUNDED: 'neutral',
  VOIDED: 'neutral',
};

const fulfillmentStatusLabels: Readonly<
  Record<AdminFulfillmentStatus, string>
> = {
  DELIVERED: 'Đã giao',
  DELIVERY_FAILED: 'Giao thất bại',
  PARTIALLY_FULFILLED: 'Đã xử lý một phần',
  PROCESSING: 'Đang xử lý',
  RETURN_TO_SENDER: 'Hoàn về kho',
  SHIPPED: 'Đã gửi hàng',
  UNFULFILLED: 'Chưa xử lý',
};

const fulfillmentStatusTones: Readonly<Record<AdminFulfillmentStatus, Tone>> = {
  DELIVERED: 'success',
  DELIVERY_FAILED: 'danger',
  PARTIALLY_FULFILLED: 'warning',
  PROCESSING: 'info',
  RETURN_TO_SENDER: 'danger',
  SHIPPED: 'info',
  UNFULFILLED: 'neutral',
};

export function orderStatusLabel(status: AdminOrderStatus): string {
  return orderStatusLabels[status];
}

export function orderStatusTone(status: AdminOrderStatus): Tone {
  return orderStatusTones[status];
}

export function paymentStatusLabel(status: AdminPaymentStatus): string {
  return paymentStatusLabels[status];
}

export function paymentStatusTone(status: AdminPaymentStatus): Tone {
  return paymentStatusTones[status];
}

export function fulfillmentStatusLabel(status: AdminFulfillmentStatus): string {
  return fulfillmentStatusLabels[status];
}

export function fulfillmentStatusTone(status: AdminFulfillmentStatus): Tone {
  return fulfillmentStatusTones[status];
}
