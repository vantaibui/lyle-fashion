import type { Metadata } from 'next';

import { CatalogPage } from '@/modules/catalog/components/catalog-page';
import { createCatalogMetadata } from '@/modules/catalog/services/catalog-metadata';
import { getCatalogPageData } from '@/modules/catalog/services/catalog-page';
import type { SearchParamRecord } from '@/lib/validation/search-params';

const route = { gender: 'women', kind: 'gender', pathname: '/women' } as const;
type PageProps = { searchParams: Promise<SearchParamRecord> };

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { landing, searchState } = await getCatalogPageData(route, params);
  return landing.data
    ? createCatalogMetadata(landing.data, route.pathname, searchState)
    : { title: 'Thời trang nữ', robots: { index: false, follow: false } };
}

export default async function Page({ searchParams }: PageProps) {
  return <CatalogPage route={route} searchParams={await searchParams} />;
}
