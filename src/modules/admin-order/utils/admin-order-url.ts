import type { AdminOrderSearchState } from '@/modules/admin-order/schemas/admin-order-search-params';

export function adminOrderPageHref(
  searchState: AdminOrderSearchState,
  page: number,
) {
  const params = new URLSearchParams();
  if (searchState.q) params.set('q', searchState.q);
  if (searchState.orderStatus)
    params.set('orderStatus', searchState.orderStatus);
  if (searchState.paymentStatus)
    params.set('paymentStatus', searchState.paymentStatus);
  if (searchState.fulfillmentStatus)
    params.set('fulfillmentStatus', searchState.fulfillmentStatus);
  if (page !== 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/admin/orders?${query}` : '/admin/orders';
}
