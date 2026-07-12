import { describe, expect, it } from 'vitest';

import {
  catalogHref,
  clearCatalogFilters,
  withCatalogFilter,
  withCatalogPage,
  withCatalogSort,
  withoutCatalogFilter,
} from '@/modules/catalog/utils/catalog-url';

const state = {
  material: ['linen', 'lyocell'],
  page: 3,
  sort: 'newest' as const,
};

describe('catalog URL state', () => {
  it('adds and removes filters while resetting pagination', () => {
    expect(withCatalogFilter(state, 'size', 'm', true)).toMatchObject({
      page: 1,
      size: ['m'],
    });
    expect(withoutCatalogFilter(state, 'material', 'linen')).toMatchObject({
      material: ['lyocell'],
      page: 1,
    });
  });

  it('clears filters but preserves sorting', () => {
    expect(clearCatalogFilters(state)).toEqual({
      page: 1,
      q: undefined,
      sort: 'newest',
    });
  });

  it('resets the page for sorting and retains it for pagination', () => {
    expect(withCatalogSort(state, 'price-asc').page).toBe(1);
    expect(withCatalogPage(state, 2).page).toBe(2);
  });

  it('builds stable shareable URLs', () => {
    expect(catalogHref('/shop', state)).toBe(
      '/shop?material=linen&material=lyocell&page=3&sort=newest',
    );
  });
});
