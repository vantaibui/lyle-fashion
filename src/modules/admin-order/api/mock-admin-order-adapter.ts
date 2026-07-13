import 'server-only';

import type {
  AdminOrderDetailProvider,
  AdminOrderListItem,
  AdminOrderListProvider,
} from '@/modules/admin-order/contracts/admin-order';

/** Development fixture only. Replace with the approved OMS backend. */
const mockOrders: AdminOrderListItem[] = [
  {
    code: 'LYLE-DEMO-2401',
    createdAt: '2026-07-01T02:30:00.000Z',
    currency: 'VND',
    customerSummary: 'Khách hàng L*** (090***4567)',
    deliveryMethod: 'Giao hàng tiêu chuẩn',
    fulfillmentStatus: 'DELIVERED',
    id: 'order-demo-2401',
    orderStatus: 'COMPLETED',
    paymentMethod: 'cod',
    paymentStatus: 'CAPTURED',
    total: 429000,
  },
  {
    code: 'LYLE-DEMO-2402',
    createdAt: '2026-07-10T08:12:00.000Z',
    currency: 'VND',
    customerSummary: 'Khách hàng N*** (091***1234)',
    deliveryMethod: 'Giao hàng nhanh',
    fulfillmentStatus: 'PROCESSING',
    id: 'order-demo-2402',
    orderStatus: 'CONFIRMED',
    paymentMethod: 'mock_vnpay',
    paymentStatus: 'CAPTURED',
    total: 699000,
  },
  {
    code: 'LYLE-DEMO-2403',
    createdAt: '2026-07-11T15:45:00.000Z',
    currency: 'VND',
    customerSummary: 'Khách hàng T*** (093***7890)',
    deliveryMethod: 'Giao hàng tiêu chuẩn',
    fulfillmentStatus: 'UNFULFILLED',
    id: 'order-demo-2403',
    orderStatus: 'PENDING_CONFIRMATION',
    paymentMethod: 'cod',
    paymentStatus: 'PENDING',
    total: 1099000,
  },
];

export const mockAdminOrderDetailAdapter: AdminOrderDetailProvider = async (
  orderId,
) => {
  return {
    data: mockOrders.find((order) => order.id === orderId) ?? null,
    error: null,
  };
};

export const mockAdminOrderAdapter: AdminOrderListProvider = async (query) => {
  let filtered = mockOrders;

  if (query.q) {
    const needle = query.q.toLowerCase();
    filtered = filtered.filter((order) =>
      order.code.toLowerCase().includes(needle),
    );
  }
  if (query.orderStatus)
    filtered = filtered.filter(
      (order) => order.orderStatus === query.orderStatus,
    );
  if (query.paymentStatus)
    filtered = filtered.filter(
      (order) => order.paymentStatus === query.paymentStatus,
    );
  if (query.fulfillmentStatus)
    filtered = filtered.filter(
      (order) => order.fulfillmentStatus === query.fulfillmentStatus,
    );

  const sorted = [...filtered].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );

  const page = query.page;
  const start = (page - 1) * query.pageSize;
  const items = sorted.slice(start, start + query.pageSize);

  return {
    data: {
      items,
      pagination: {
        page,
        pageSize: query.pageSize,
        total: sorted.length,
        totalPages: Math.max(1, Math.ceil(sorted.length / query.pageSize)),
      },
    },
    error: null,
  };
};
