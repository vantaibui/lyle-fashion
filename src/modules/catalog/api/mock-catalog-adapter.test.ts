import { describe, expect, it } from 'vitest';

import { mockCatalogAdapter } from '@/modules/catalog/api/mock-catalog-adapter';

const query = {
  page: 1,
  pageSize: 4,
  sort: 'recommended' as const,
};

describe('mock catalog adapter', () => {
  it('paginates server-side and returns totals', async () => {
    const response = await mockCatalogAdapter(query, {});
    expect(response.error).toBeNull();
    expect(response.data?.products).toHaveLength(4);
    expect(response.data?.pagination).toMatchObject({
      page: 1,
      pageSize: 4,
      total: 12,
    });
  });

  it('sorts by authoritative summary price', async () => {
    const response = await mockCatalogAdapter(
      { ...query, sort: 'price-desc' },
      {},
    );
    const prices =
      response.data?.products.map((product) => product.price) ?? [];
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('returns an explicit empty result', async () => {
    const response = await mockCatalogAdapter(
      { ...query, promotion: ['active'] },
      {},
    );
    expect(response.data?.products).toEqual([]);
    expect(response.data?.pagination.total).toBe(0);
  });
});
