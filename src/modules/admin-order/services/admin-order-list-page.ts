import 'server-only';

import { cache } from 'react';

import { adminOrderConfig } from '@/modules/admin-order/admin-order-config';
import { parseAdminOrderSearchParams } from '@/modules/admin-order/schemas/admin-order-search-params';
import type { SearchParamRecord } from '@/modules/admin-order/schemas/admin-order-search-params';

const getAdminOrderListDataCached = cache(async (paramsJson: string) => {
  const params = JSON.parse(paramsJson) as SearchParamRecord;
  const searchState = parseAdminOrderSearchParams(params);
  const query = {
    ...searchState,
    page: searchState.page ?? 1,
    pageSize: adminOrderConfig.pageSize,
  };
  const result = await adminOrderConfig.listProvider(query, {});
  return { result, searchState };
});

export function getAdminOrderListData(params: SearchParamRecord) {
  return getAdminOrderListDataCached(JSON.stringify(params));
}
