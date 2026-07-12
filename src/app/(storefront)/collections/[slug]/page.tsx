import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogPage } from '@/modules/catalog/components/catalog-page';
import { createCatalogMetadata } from '@/modules/catalog/services/catalog-metadata';
import { getCatalogPageData } from '@/modules/catalog/services/catalog-page';
import { collectionParamsSchema } from '@/lib/validation/route-params';
import type { SearchParamRecord } from '@/lib/validation/search-params';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParamRecord>;
};

function collectionRoute(slug: string) {
  return {
    collectionSlug: slug,
    kind: 'collection',
    pathname: `/collections/${slug}`,
  } as const;
}

export function generateStaticParams() {
  return [
    'new-arrival',
    'best-seller',
    'eco-collection',
    'premium-collection',
    'linen-collection',
    'lyocell-collection',
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const parsed = collectionParamsSchema.safeParse(await params);
  if (!parsed.success) return { robots: { index: false, follow: false } };
  const route = collectionRoute(parsed.data.slug);
  const query = await searchParams;
  const { landing, searchState } = await getCatalogPageData(route, query);
  return landing.data
    ? createCatalogMetadata(landing.data, route.pathname, searchState)
    : { title: 'Bộ sưu tập', robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: PageProps) {
  const parsed = collectionParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  return (
    <CatalogPage
      route={collectionRoute(parsed.data.slug)}
      searchParams={await searchParams}
    />
  );
}
