import type { PublicOrder } from '@/modules/order/contracts/order';

export type TimelineStep = { complete: boolean; label: string };

export function buildOrderTimeline(order: PublicOrder): TimelineStep[] {
  if (order.orderStatus === 'CANCELLED')
    return [{ complete: true, label: 'Đơn hàng đã hủy' }];
  const fulfillment = [
    'UNFULFILLED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
  ].indexOf(order.fulfillmentStatus);
  return [
    { complete: true, label: 'Đã tiếp nhận đơn hàng' },
    { complete: order.orderStatus === 'CONFIRMED', label: 'Đã xác nhận' },
    { complete: fulfillment >= 1, label: 'Đang chuẩn bị' },
    { complete: fulfillment >= 2, label: 'Đang giao' },
    { complete: fulfillment >= 3, label: 'Đã giao' },
  ];
}
