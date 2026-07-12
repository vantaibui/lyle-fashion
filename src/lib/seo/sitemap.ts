import { publicEnv } from '@/config/env/public';
import { canonicalUrl } from '@/lib/seo/url';
import { isIndexingEnabled } from '@/lib/seo/policy';
import { getPublishedProductSlugs } from '@/modules/product/api/mock-product-adapter';

const collectionSlugs = [
  'new-arrival',
  'best-seller',
  'eco-collection',
  'premium-collection',
  'linen-collection',
  'lyocell-collection',
] as const;

const publicCatalogRoutes = ['/shop', '/men', '/women'] as const;

export function createSitemapEntries() {
  if (
    !isIndexingEnabled({
      explicitFlag: publicEnv.NEXT_PUBLIC_ENABLE_INDEXING,
      siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    })
  ) {
    return [];
  }

  return [
    ...publicCatalogRoutes.map((pathname) => ({
      changeFrequency: 'daily' as const,
      priority: pathname === '/shop' ? 0.9 : 0.8,
      url: canonicalUrl(pathname),
    })),
    ...collectionSlugs.map((slug) => ({
      changeFrequency: 'daily' as const,
      priority: 0.8,
      url: canonicalUrl(`/collections/${slug}`),
    })),
    ...getPublishedProductSlugs().map((slug) => ({
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      url: canonicalUrl(`/product/${slug}`),
    })),
  ];
}
