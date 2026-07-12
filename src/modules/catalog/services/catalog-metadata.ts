import type { Metadata } from 'next';

import { publicEnv } from '@/config/env/public';
import { createRobotsDirectives, isIndexingEnabled } from '@/lib/seo/policy';
import type { CatalogLandingContent } from '@/modules/catalog/contracts/catalog';
import { catalogHref } from '@/modules/catalog/utils/catalog-url';
import { canonicalUrlWithSearch } from '@/lib/seo/url';
import type { ProductSearchState } from '@/lib/validation/search-params';

const nonIndexableKeys: Array<keyof ProductSearchState> = [
  'availability',
  'category',
  'collection',
  'color',
  'gender',
  'material',
  'priceTier',
  'promotion',
  'q',
  'size',
  'sort',
  'style',
  'variant',
];

export function hasIndexBlockingCatalogState(state: ProductSearchState) {
  return nonIndexableKeys.some((key) => {
    const value = state[key];
    if (key === 'sort') return value !== undefined && value !== 'relevance';
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
}

export function createCatalogMetadata(
  landing: CatalogLandingContent,
  pathname: string,
  state: ProductSearchState,
): Metadata {
  const hasBlockingState = hasIndexBlockingCatalogState(state);
  const canonicalState: ProductSearchState = {
    page: hasBlockingState ? 1 : state.page,
    sort: 'relevance',
  };
  const canonical = canonicalUrlWithSearch(
    catalogHref(pathname, canonicalState),
  );
  const pageSuffix =
    !hasBlockingState && (state.page ?? 1) > 1 ? ` – Trang ${state.page}` : '';
  const allowIndexing =
    !hasBlockingState &&
    isIndexingEnabled({
      explicitFlag: publicEnv.NEXT_PUBLIC_ENABLE_INDEXING,
      siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    });

  return {
    title: `${landing.title}${pageSuffix}`,
    description: landing.seoDescription,
    alternates: { canonical },
    openGraph: {
      description: landing.seoDescription,
      locale: 'vi_VN',
      title: `${landing.title}${pageSuffix}`,
      type: 'website',
      url: canonical,
    },
    robots: createRobotsDirectives(allowIndexing),
    twitter: {
      card: 'summary_large_image',
      description: landing.seoDescription,
      title: `${landing.title}${pageSuffix}`,
    },
  };
}
