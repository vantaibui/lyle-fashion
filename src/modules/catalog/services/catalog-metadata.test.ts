import { describe, expect, it } from 'vitest';

import { createCatalogMetadata } from '@/modules/catalog/services/catalog-metadata';

const landing = {
  breadcrumbLabel: 'Cửa hàng',
  id: 'shop',
  seoDescription: 'Mô tả cửa hàng',
  slug: 'shop',
  title: 'Cửa hàng',
};

describe('catalog metadata', () => {
  it('creates crawlable pagination canonicals without indexing before launch', () => {
    const metadata = createCatalogMetadata(landing, '/shop', {
      page: 2,
      sort: 'relevance',
    });
    expect(metadata.alternates).toEqual({
      canonical: 'http://localhost:3000/shop?page=2',
    });
    expect(metadata.title).toBe('Cửa hàng – Trang 2');
  });

  it('canonicalizes arbitrary filters to the landing and blocks following', () => {
    const metadata = createCatalogMetadata(landing, '/shop', {
      material: ['linen'],
      page: 2,
      sort: 'newest',
    });
    expect(metadata.alternates).toEqual({
      canonical: 'http://localhost:3000/shop',
    });
    expect(metadata.robots).toEqual({
      follow: false,
      index: false,
      nocache: true,
    });
  });
});
