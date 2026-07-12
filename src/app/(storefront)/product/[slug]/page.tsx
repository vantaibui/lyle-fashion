import type { Metadata } from 'next';
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
import { createBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';
import { canonicalUrl } from '@/lib/seo/url';
import { productParamsSchema } from '@/lib/validation/route-params';
import { ProductCard } from '@/modules/catalog/components/product-card';
import { ProductDetailClient } from '@/modules/product/components/product-detail-client';
import { createProductMetadata } from '@/modules/product/services/product-metadata';
import { getProductPageData } from '@/modules/product/services/product-page';
import { createProductJsonLd } from '@/modules/product/services/product-schema';
import type { ProductSearchState } from '@/modules/product/contracts/product';
import { getPublishedProductSlugs } from '@/modules/product/api/mock-product-adapter';

export const revalidate = 900;

export function generateStaticParams() {
  return getPublishedProductSlugs().map((slug) => ({ slug }));
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
};

function parseSearchParams(
  rawParams: Record<string, string | string[] | undefined>,
): ProductSearchState {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return {
    color: first(rawParams.color),
    size: first(rawParams.size),
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const parsedParams = productParamsSchema.safeParse(await params);
  if (!parsedParams.success) return {};

  const data = await getProductPageData(
    parsedParams.data.slug,
    parseSearchParams(await searchParams),
  );
  if (!data) return {};

  return createProductMetadata(data);
}

export default async function Page({ params, searchParams }: PageProps) {
  const result = productParamsSchema.safeParse(await params);
  if (!result.success) notFound();
  const data = await getProductPageData(
    result.data.slug,
    parseSearchParams(await searchParams),
  );
  if (!data) notFound();

  const breadcrumbItems = [
    { href: '/', label: 'Trang chủ' },
    { href: data.product.category.href, label: data.product.category.label },
    { current: true, label: data.product.name },
  ];
  const breadcrumbJsonLd = createBreadcrumbJsonLd(
    breadcrumbItems.map((item) => ({
      name: String(item.label),
      url: canonicalUrl(item.href ?? `/product/${data.product.slug}`),
    })),
  );
  const productJsonLd = createProductJsonLd(data);

  return (
    <main className="pb-28 md:pb-0">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
        type="application/ld+json"
      />

      <Container className="py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 md:mt-8">
          <ProductDetailClient
            product={data.product}
            selection={data.selection}
          />
        </div>

        <section className="mt-16 grid gap-5 border-t pt-8 md:mt-20">
          <div className="max-w-2xl">
            <p className="text-text-subtle text-xs tracking-[0.18em] uppercase">
              Gợi ý tiếp tục khám phá
            </p>
            <h2 className="font-display mt-2 text-3xl leading-tight">
              Sản phẩm liên quan
            </h2>
          </div>

          {data.recommendationsError ? (
            <ErrorState
              action={<Link href="/shop">Về cửa hàng</Link>}
              description="Danh sách gợi ý chưa thể tải, nhưng thông tin sản phẩm hiện tại vẫn an toàn để tiếp tục."
              title="Chưa thể tải gợi ý"
            />
          ) : data.product.recommendations.length === 0 ? (
            <EmptyState
              action={<Link href="/shop">Xem tất cả sản phẩm</Link>}
              description="Chúng tôi chưa có gợi ý phù hợp cho sản phẩm này trong dữ liệu minh hoạ hiện tại."
              title="Chưa có gợi ý liên quan"
            />
          ) : (
            <ProductGridShell aria-label="Sản phẩm liên quan">
              {data.product.recommendations.map((product) => (
                <ProductGridItem key={product.id}>
                  <ProductCard product={product} />
                </ProductGridItem>
              ))}
            </ProductGridShell>
          )}
        </section>
      </Container>
    </main>
  );
}
