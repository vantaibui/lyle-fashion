import type { Metadata } from 'next';

import { CatalogPage } from '@/modules/catalog/components/catalog-page';
import { createRouteMetadata } from '@/lib/seo/metadata';
import type { SearchParamRecord } from '@/lib/validation/search-params';

// Search results reuse the shop catalog surface; the `q` param filters the grid.
const route = { kind: 'shop', pathname: '/shop' } as const;

type PageProps = { searchParams: Promise<SearchParamRecord> };

// Query strings are potentially sensitive and content is query-dependent.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const term = typeof q === 'string' ? q.trim() : '';
  return createRouteMetadata({
    description: 'Kết quả tìm kiếm sản phẩm LYLE Fashion.',
    pathname: '/search',
    title: term ? `Tìm kiếm: ${term}` : 'Tìm kiếm',
  });
}

export default async function Page({ searchParams }: PageProps) {
  return <CatalogPage route={route} searchParams={await searchParams} />;
}
