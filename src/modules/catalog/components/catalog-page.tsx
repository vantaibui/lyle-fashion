import { notFound } from 'next/navigation';

import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import {
  ProductGridItem,
  ProductGridShell,
} from '@/components/commerce/product-grid-shell';
import { Container } from '@/components/layout/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Link } from '@/components/ui/link';
import { Pagination } from '@/components/ui/pagination';
import { canonicalUrl } from '@/lib/seo/url';
import { createBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';
import type { SearchParamRecord } from '@/lib/validation/search-params';
import { CatalogControls } from '@/modules/catalog/components/catalog-controls';
import { CatalogImpression } from '@/modules/catalog/components/catalog-impression';
import { ProductCard } from '@/modules/catalog/components/product-card';
import type { CatalogFilterKey } from '@/modules/catalog/contracts/catalog';
import {
  getCatalogPageData,
  type CatalogRoute,
} from '@/modules/catalog/services/catalog-page';
import {
  catalogHref,
  clearCatalogFilters,
  withCatalogPage,
} from '@/modules/catalog/utils/catalog-url';

export async function CatalogPage({
  route,
  searchParams,
}: {
  route: CatalogRoute;
  searchParams: SearchParamRecord;
}) {
  const { landing, result, searchState } = await getCatalogPageData(
    route,
    searchParams,
  );

  if (!landing.error && !landing.data && route.kind === 'collection')
    notFound();
  if (landing.error || !landing.data) {
    return (
      <CatalogError
        description="Thông tin danh mục chưa thể tải. Vui lòng thử lại."
        pathname={route.pathname}
        requestId={landing.error?.requestId}
      />
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Trang chủ' },
    ...(route.kind === 'collection'
      ? [{ href: '/shop', label: 'Cửa hàng' }]
      : []),
    { current: true, label: landing.data.breadcrumbLabel },
  ];
  const breadcrumbJsonLd = createBreadcrumbJsonLd(
    breadcrumbItems.map((item) => ({
      name: String(item.label),
      url: canonicalUrl(item.href ?? route.pathname),
    })),
  );
  const hiddenFilterKeys: CatalogFilterKey[] =
    route.kind === 'gender'
      ? ['gender']
      : route.kind === 'collection'
        ? ['collection']
        : [];

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <Container className="py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        <header className="border-brand-flax mt-5 max-w-3xl border-l pl-5 md:mt-8 md:pl-8">
          <p className="text-text-subtle tracking-caps text-xs font-medium uppercase">
            LYLE Fashion
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
            {landing.data.title}
          </h1>
          {landing.data.description && (
            <p className="text-text-muted mt-4 max-w-2xl text-lg">
              {landing.data.description}
            </p>
          )}
        </header>

        {result.error ? (
          <div className="mt-10">
            <ErrorState
              action={
                <Link href={catalogHref(route.pathname, searchState)}>
                  Thử lại
                </Link>
              }
              description={
                <>
                  Dữ liệu sản phẩm chưa thể tải. URL bộ lọc của bạn vẫn được
                  giữ.
                  {result.error.requestId && (
                    <span className="mt-2 block text-sm">
                      Mã tham chiếu: {result.error.requestId}
                    </span>
                  )}
                </>
              }
            />
          </div>
        ) : (
          <CatalogControls
            facets={result.data.facets}
            hiddenFilterKeys={hiddenFilterKeys}
            pathname={route.pathname}
            searchState={searchState}
            sortOptions={result.data.sortOptions}
            total={result.data.pagination.total}
          >
            <CatalogImpression
              listId={landing.data.id}
              total={result.data.pagination.total}
            />
            {result.data.products.length === 0 ? (
              <EmptyState
                action={
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href={catalogHref(
                        route.pathname,
                        clearCatalogFilters(searchState),
                      )}
                    >
                      Xóa tất cả bộ lọc
                    </Link>
                    {route.pathname !== '/shop' && (
                      <Link href="/shop">Xem cửa hàng</Link>
                    )}
                  </div>
                }
                description="Không có sản phẩm phù hợp với các bộ lọc đang chọn. Hãy bỏ một bộ lọc hoặc bắt đầu lại."
                title="Chưa tìm thấy sản phẩm phù hợp"
              />
            ) : (
              <>
                <ProductGridShell aria-label="Danh sách sản phẩm">
                  {result.data.products.map((product, index) => (
                    <ProductGridItem key={product.id}>
                      <ProductCard eager={index < 4} product={product} />
                    </ProductGridItem>
                  ))}
                </ProductGridShell>
                {result.data.pagination.totalPages > 1 && (
                  <Pagination
                    className="mt-12"
                    currentPage={result.data.pagination.page}
                    getHref={(page) =>
                      catalogHref(
                        route.pathname,
                        withCatalogPage(searchState, page),
                      )
                    }
                    totalPages={result.data.pagination.totalPages}
                  />
                )}
              </>
            )}
          </CatalogControls>
        )}

        <section
          className="border-border-subtle mt-16 max-w-3xl border-t pt-8"
          aria-labelledby="catalog-note"
        >
          <h2 className="font-display text-2xl" id="catalog-note">
            Chọn theo nhu cầu của bạn
          </h2>
          <p className="text-text-muted mt-3">
            Dùng bộ lọc để thu hẹp theo chất liệu, phom dáng và kích thước. Giá
            và tình trạng sản phẩm sẽ được xác nhận lại bởi hệ thống thương mại
            khi tích hợp.
          </p>
        </section>
      </Container>
    </main>
  );
}

function CatalogError({
  description,
  pathname,
  requestId,
}: {
  description: string;
  pathname: string;
  requestId?: string;
}) {
  return (
    <main>
      <Container className="py-12">
        <ErrorState
          action={<Link href={pathname}>Thử lại</Link>}
          description={
            <>
              {description}
              {requestId && (
                <span className="mt-2 block">Mã tham chiếu: {requestId}</span>
              )}
            </>
          }
        />
      </Container>
    </main>
  );
}
