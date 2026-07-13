import type { AdminProductSearchState } from '@/modules/admin-product/schemas/admin-product-search-params';

export function adminProductPageHref(
  searchState: AdminProductSearchState,
  page: number,
) {
  const params = new URLSearchParams();
  if (searchState.q) params.set('q', searchState.q);
  if (searchState.status) params.set('status', searchState.status);
  if (searchState.category) params.set('category', searchState.category);
  if (searchState.collection) params.set('collection', searchState.collection);
  if (searchState.material) params.set('material', searchState.material);
  if (searchState.sort && searchState.sort !== 'updated-desc')
    params.set('sort', searchState.sort);
  if (page !== 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/admin/products?${query}` : '/admin/products';
}
