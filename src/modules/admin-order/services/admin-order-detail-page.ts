import 'server-only';

import { cache } from 'react';

import { adminOrderConfig } from '@/modules/admin-order/admin-order-config';

export const getAdminOrderDetail = cache(async (orderId: string) => {
  return adminOrderConfig.detailProvider(orderId, {});
});
