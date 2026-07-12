import { commerceServerRequest } from '@/lib/api/server-client';
import { ApiError } from '@/lib/api/error';
import type {
  CatalogLandingProvider,
  CatalogResultProvider,
} from '@/modules/catalog/contracts/catalog';
import {
  catalogLandingContentSchema,
  catalogResultSchema,
} from '@/modules/catalog/schemas/catalog';

function buildQueryString(query: Parameters<CatalogResultProvider>[0]): string {
  const params = new URLSearchParams();
  const multi: Array<[string, string[] | undefined]> = [
    ['availability', query.availability],
    ['category', query.category],
    ['collection', query.collection],
    ['color', query.color],
    ['gender', query.gender],
    ['material', query.material],
    ['priceTier', query.priceTier],
    ['promotion', query.promotion],
    ['size', query.size],
    ['style', query.style],
  ];
  for (const [key, values] of multi) {
    for (const value of values ?? []) params.append(key, value);
  }
  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  params.set('sort', query.sort);
  return params.toString();
}

/** Production adapter foundation. Field mapping/normalization applies once the catalog provider contract is approved. */
export const catalogApi: CatalogResultProvider = async (query, { signal }) => {
  const response = await commerceServerRequest<unknown>(
    `/catalog/products?${buildQueryString(query)}`,
    { retries: 1, signal, timeoutMs: 8_000 },
  );

  if (response.error) return response;
  const parsed = catalogResultSchema.safeParse(response.data);
  if (!parsed.success) {
    return {
      data: null,
      error: new ApiError('Dữ liệu danh mục sản phẩm không hợp lệ.', {
        code: 'UNEXPECTED_SERVER_ERROR',
      }),
    };
  }

  return { data: parsed.data, error: null };
};

export const catalogLandingApi: CatalogLandingProvider = async (
  identifier,
  { signal },
) => {
  const path =
    'collectionSlug' in identifier && identifier.collectionSlug
      ? `/catalog/landing/collections/${encodeURIComponent(identifier.collectionSlug)}`
      : 'shop' in identifier && identifier.shop
        ? '/catalog/landing/shop'
        : `/catalog/landing/gender/${encodeURIComponent(identifier.gender ?? '')}`;

  const response = await commerceServerRequest<unknown>(path as `/${string}`, {
    retries: 1,
    signal,
    timeoutMs: 8_000,
  });

  if (response.error) {
    if (response.error.code === 'NOT_FOUND') {
      return { data: null, error: null };
    }
    return response;
  }

  const parsed = catalogLandingContentSchema.safeParse(response.data);
  if (!parsed.success) {
    return {
      data: null,
      error: new ApiError('Dữ liệu trang danh mục không hợp lệ.', {
        code: 'UNEXPECTED_SERVER_ERROR',
      }),
    };
  }

  return { data: parsed.data, error: null };
};
