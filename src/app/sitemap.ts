import type { MetadataRoute } from 'next';

import { createSitemapEntries } from '@/lib/seo/sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries();
}
