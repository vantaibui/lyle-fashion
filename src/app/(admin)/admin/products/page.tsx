import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Pagination } from '@/components/ui/pagination';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminProductFilters } from '@/modules/admin-product/components/admin-product-filters';
import { AdminProductTable } from '@/modules/admin-product/components/admin-product-table';
import { getAdminProductListData } from '@/modules/admin-product/services/admin-product-list-page';
import { adminProductPageHref } from '@/modules/admin-product/utils/admin-product-url';
import { hasAdminPermission } from '@/modules/admin-auth/contracts/session';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { requirePagePermission } from '@/modules/admin-auth/server/require-admin-permission';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';
import type { SearchParamRecord } from '@/modules/admin-product/schemas/admin-product-search-params';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Quản lý danh mục sản phẩm LYLE Fashion.',
  pathname: '/admin/products',
  title: 'Sản phẩm',
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const session = await requireAdminAuth('/admin/products');
  requirePagePermission(session, 'product.read');
  const canCreate = hasAdminPermission(session, 'product.create');
  const canUpdate = hasAdminPermission(session, 'product.update');

  const params = await searchParams;
  const { result, searchState } = await getAdminProductListData(params);

  return (
    <AdminShell
      activePath="/admin/products"
      breadcrumbs={[
        { href: '/admin', label: 'Tổng quan' },
        { current: true, label: 'Sản phẩm' },
      ]}
      session={session}
      title="Sản phẩm"
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <AdminProductFilters searchState={searchState} />
          {canCreate && (
            <Button size="sm" type="button">
              Tạo sản phẩm
            </Button>
          )}
        </div>

        {result.error ? (
          <ErrorState description="Không thể tải danh sách sản phẩm. Vui lòng thử lại sau." />
        ) : result.data.items.length === 0 ? (
          <EmptyState
            description="Không có sản phẩm nào khớp với bộ lọc hiện tại."
            title="Không tìm thấy sản phẩm"
          />
        ) : (
          <>
            <AdminProductTable
              canUpdate={canUpdate}
              items={result.data.items}
            />
            {result.data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={result.data.pagination.page}
                getHref={(page) => adminProductPageHref(searchState, page)}
                totalPages={result.data.pagination.totalPages}
              />
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
