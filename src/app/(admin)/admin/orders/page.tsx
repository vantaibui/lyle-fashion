import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Pagination } from '@/components/ui/pagination';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminOrderFilters } from '@/modules/admin-order/components/admin-order-filters';
import { AdminOrderTable } from '@/modules/admin-order/components/admin-order-table';
import { getAdminOrderListData } from '@/modules/admin-order/services/admin-order-list-page';
import { adminOrderPageHref } from '@/modules/admin-order/utils/admin-order-url';
import type { SearchParamRecord } from '@/modules/admin-order/schemas/admin-order-search-params';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { requirePagePermission } from '@/modules/admin-auth/server/require-admin-permission';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Quản lý đơn hàng LYLE Fashion.',
  pathname: '/admin/orders',
  title: 'Đơn hàng',
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const session = await requireAdminAuth('/admin/orders');
  requirePagePermission(session, 'order.read');

  const params = await searchParams;
  const { result, searchState } = await getAdminOrderListData(params);

  return (
    <AdminShell
      activePath="/admin/orders"
      breadcrumbs={[
        { href: '/admin', label: 'Tổng quan' },
        { current: true, label: 'Đơn hàng' },
      ]}
      session={session}
      title="Đơn hàng"
    >
      <div className="grid gap-6">
        <AdminOrderFilters searchState={searchState} />

        {result.error ? (
          <ErrorState description="Không thể tải danh sách đơn hàng. Vui lòng thử lại sau." />
        ) : result.data.items.length === 0 ? (
          <EmptyState
            description="Không có đơn hàng nào khớp với bộ lọc hiện tại."
            title="Không tìm thấy đơn hàng"
          />
        ) : (
          <>
            <AdminOrderTable items={result.data.items} />
            {result.data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={result.data.pagination.page}
                getHref={(page) => adminOrderPageHref(searchState, page)}
                totalPages={result.data.pagination.totalPages}
              />
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
