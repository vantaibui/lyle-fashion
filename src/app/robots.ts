import type { MetadataRoute } from 'next';

import { publicEnv } from '@/config/env/public';
import { isIndexingEnabled } from '@/lib/seo/policy';

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled = isIndexingEnabled({
    explicitFlag: publicEnv.NEXT_PUBLIC_ENABLE_INDEXING,
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  });

  return {
    rules: indexingEnabled
      ? {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/account/',
            '/cart',
            '/checkout',
            '/order-success',
            '/order-tracking',
            '/search',
            '/wishlist',
          ],
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: new URL('/sitemap.xml', publicEnv.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
