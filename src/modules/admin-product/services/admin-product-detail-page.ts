import 'server-only';

import { cache } from 'react';

import { adminProductConfig } from '@/modules/admin-product/admin-product-config';

export const getAdminProductDetail = cache(async (productId: string) => {
  return adminProductConfig.detailProvider(productId, {});
});
