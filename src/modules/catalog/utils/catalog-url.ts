import type { CatalogFilterKey } from '@/modules/catalog/contracts/catalog';
import {
  serializeProductSearchParams,
  type ProductSearchState,
} from '@/lib/validation/search-params';

export type CatalogFilterStateKey = Exclude<CatalogFilterKey, never>;

export function withCatalogFilter(
  state: ProductSearchState,
  key: CatalogFilterStateKey,
  value: string,
  selected: boolean,
): ProductSearchState {
  const current = state[key] ?? [];
  const next = selected
    ? [...new Set([...current, value])]
    : current.filter((item) => item !== value);
  return { ...state, [key]: next.length ? next : undefined, page: 1 };
}

export function withoutCatalogFilter(
  state: ProductSearchState,
  key: CatalogFilterStateKey,
  value: string,
) {
  return withCatalogFilter(state, key, value, false);
}

export function clearCatalogFilters(
  state: ProductSearchState,
): ProductSearchState {
  return {
    page: 1,
    q: state.q,
    sort: state.sort,
  };
}

export function withCatalogSort(
  state: ProductSearchState,
  sort: NonNullable<ProductSearchState['sort']>,
): ProductSearchState {
  return { ...state, page: 1, sort };
}

export function withCatalogPage(state: ProductSearchState, page: number) {
  return { ...state, page };
}

export function catalogHref(pathname: string, state: ProductSearchState) {
  const query = serializeProductSearchParams(state);
  return query ? `${pathname}?${query}` : pathname;
}
