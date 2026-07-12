import { describe, expect, it } from 'vitest';
import { buildOrderTimeline } from './order-timeline';
import type { PublicOrder } from '@/modules/order/contracts/order';

const base = {
  fulfillmentStatus: 'SHIPPED',
  orderStatus: 'CONFIRMED',
} as PublicOrder;
describe('buildOrderTimeline', () => {
  it('does not mark delivery before delivered', () => {
    expect(buildOrderTimeline(base).at(-1)?.complete).toBe(false);
  });
  it('shows cancellation without misleading fulfillment steps', () => {
    expect(buildOrderTimeline({ ...base, orderStatus: 'CANCELLED' })).toEqual([
      { complete: true, label: 'Đơn hàng đã hủy' },
    ]);
  });
});
