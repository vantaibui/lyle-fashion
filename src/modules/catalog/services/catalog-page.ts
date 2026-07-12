import { cache } from 'react';

import type {
  CatalogGender,
  CatalogLandingIdentifier,
  CatalogQuery,
} from '@/modules/catalog/contracts/catalog';
import { catalogConfig } from '@/modules/catalog/catalog-config';
import {
  parseProductSearchParams,
  type SearchParamRecord,
} from '@/lib/validation/search-params';

export type CatalogRoute =
  | { kind: 'shop'; pathname: '/shop' }
  | { kind: 'gender'; pathname: '/men' | '/women'; gender: CatalogGender }
  | {
      kind: 'collection';
      pathname: `/collections/${string}`;
      collectionSlug: string;
    };

function landingIdentifier(route: CatalogRoute): CatalogLandingIdentifier {
  if (route.kind === 'shop') return { shop: true };
  if (route.kind === 'gender') return { gender: route.gender };
  return { collectionSlug: route.collectionSlug };
}

function toCatalogQuery(
  route: CatalogRoute,
  params: ReturnType<typeof parseProductSearchParams>,
): CatalogQuery {
  const requestedGender = params.gender?.filter(
    (value): value is CatalogGender =>
      value === 'men' || value === 'women' || value === 'unisex',
  );
  return {
    availability: params.availability,
    category: params.category,
    collection:
      route.kind === 'collection' ? [route.collectionSlug] : params.collection,
    color: params.color,
    gender: route.kind === 'gender' ? [route.gender] : requestedGender,
    material: params.material,
    page: params.page ?? 1,
    pageSize: catalogConfig.pageSize,
    priceTier: params.priceTier,
    promotion: params.promotion,
    size: params.size,
    sort:
      !params.sort || params.sort === 'relevance' ? 'recommended' : params.sort,
    style: params.style,
  };
}

const getCatalogPageDataCached = cache(
  async (routeJson: string, paramsJson: string) => {
    const route = JSON.parse(routeJson) as CatalogRoute;
    const rawParams = JSON.parse(paramsJson) as SearchParamRecord;
    const searchState = parseProductSearchParams(rawParams);
    const query = toCatalogQuery(route, searchState);
    const [landing, result] = await Promise.all([
      catalogConfig.landingProvider(landingIdentifier(route), {}),
      catalogConfig.resultProvider(query, {}),
    ]);
    return { landing, query, result, searchState };
  },
);

export function getCatalogPageData(
  route: CatalogRoute,
  params: SearchParamRecord,
) {
  return getCatalogPageDataCached(
    JSON.stringify(route),
    JSON.stringify(params),
  );
}
