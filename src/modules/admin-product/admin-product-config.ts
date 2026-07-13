import { mockAdminProductAdapter } from '@/modules/admin-product/api/mock-admin-product-adapter';
import { mockAdminProductDetailAdapter } from '@/modules/admin-product/api/mock-admin-product-detail-adapter';

// Temporary server adapter selection until the PIM/commerce backend is approved.
export const adminProductConfig = {
  detailProvider: mockAdminProductDetailAdapter,
  listProvider: mockAdminProductAdapter,
  pageSize: 20,
} as const;
