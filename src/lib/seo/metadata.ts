import type { Metadata } from 'next';

import { publicEnv } from '@/config/env/public';
import { createRobotsDirectives, isIndexingEnabled } from '@/lib/seo/policy';
import { canonicalUrl } from '@/lib/seo/url';

export const siteName = 'LYLE Fashion';
export const defaultSiteDescription =
  'Thời trang tối giản cao cấp cho khách hàng Việt Nam.';

export const metadataDefaults: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultSiteDescription,
  alternates: { canonical: '/' },
  openGraph: {
    description: defaultSiteDescription,
    locale: 'vi_VN',
    siteName,
    title: siteName,
    type: 'website',
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
  },
  robots: createRobotsDirectives(false),
  twitter: {
    card: 'summary_large_image',
    description: defaultSiteDescription,
    title: siteName,
  },
};

type RouteMetadataInput = {
  description: string;
  images?: Metadata['openGraph'] extends infer T
    ? T extends { images?: infer TImages }
      ? TImages
      : never
    : never;
  indexable?: boolean;
  pathname: string;
  title: string;
};

export function createRouteMetadata({
  description,
  images,
  indexable = false,
  pathname,
  title,
}: RouteMetadataInput): Metadata {
  const canonical = canonicalUrl(pathname);
  const allowIndexing =
    indexable &&
    isIndexingEnabled({
      explicitFlag: publicEnv.NEXT_PUBLIC_ENABLE_INDEXING,
      siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    });
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      description,
      images,
      locale: 'vi_VN',
      siteName,
      title,
      type: 'website',
      url: canonical,
    },
    robots: createRobotsDirectives(allowIndexing),
    twitter: {
      card: 'summary_large_image',
      description,
      title,
    },
  };
}
