import {
  mockAdminOrderAdapter,
  mockAdminOrderDetailAdapter,
} from '@/modules/admin-order/api/mock-admin-order-adapter';

// Temporary server adapter selection until the OMS backend is approved.
export const adminOrderConfig = {
  detailProvider: mockAdminOrderDetailAdapter,
  listProvider: mockAdminOrderAdapter,
  pageSize: 20,
} as const;
