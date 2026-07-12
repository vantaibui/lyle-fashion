import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env/public', () => ({
  publicEnv: {
    NEXT_PUBLIC_ENABLE_INDEXING: true,
    NEXT_PUBLIC_SITE_URL: 'https://lylefashion.vn',
  },
}));

describe('createSitemapEntries', () => {
  it('returns only canonical public catalog and product URLs', async () => {
    const { createSitemapEntries } = await import('@/lib/seo/sitemap');
    const entries = createSitemapEntries();

    expect(entries.some((entry) => entry.url.endsWith('/cart'))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith('/checkout'))).toBe(
      false,
    );
    expect(entries.some((entry) => entry.url.includes('/product/'))).toBe(true);
    expect(entries.some((entry) => entry.url.endsWith('/shop'))).toBe(true);
  });
});
