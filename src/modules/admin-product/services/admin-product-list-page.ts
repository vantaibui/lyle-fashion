import 'server-only';

import { cache } from 'react';

import { adminProductConfig } from '@/modules/admin-product/admin-product-config';
import { parseAdminProductSearchParams } from '@/modules/admin-product/schemas/admin-product-search-params';
import type { SearchParamRecord } from '@/modules/admin-product/schemas/admin-product-search-params';

const getAdminProductListDataCached = cache(async (paramsJson: string) => {
  const params = JSON.parse(paramsJson) as SearchParamRecord;
  const searchState = parseAdminProductSearchParams(params);
  const query = { ...searchState, pageSize: adminProductConfig.pageSize };
  const result = await adminProductConfig.listProvider(query, {});
  return { result, searchState };
});

export function getAdminProductListData(params: SearchParamRecord) {
  return getAdminProductListDataCached(JSON.stringify(params));
}
