import type { Metadata } from 'next';

import { publicEnv } from '@/config/env/public';
import { createRobotsDirectives, isIndexingEnabled } from '@/lib/seo/policy';
import { canonicalUrl } from '@/lib/seo/url';
import type { ProductPageData } from '@/modules/product/contracts/product';

export function createProductMetadata(data: ProductPageData): Metadata {
  const canonical = canonicalUrl(`/product/${data.product.slug}`);
  const image =
    data.selection.selectedSku?.images[0] ?? data.product.defaultGallery[0];
  const hasVariantQuery = data.selection.hasQuery;
  const allowIndexing =
    !hasVariantQuery &&
    isIndexingEnabled({
      explicitFlag: publicEnv.NEXT_PUBLIC_ENABLE_INDEXING,
      siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    });

  return {
    title: data.product.name,
    description: data.product.description,
    alternates: { canonical },
    openGraph: {
      description: data.product.description,
      images: image
        ? [
            {
              alt: image.alt,
              height: image.height,
              url: image.src,
              width: image.width,
            },
          ]
        : undefined,
      locale: 'vi_VN',
      title: data.product.name,
      type: 'website',
      url: canonical,
    },
    robots: createRobotsDirectives(allowIndexing),
    twitter: {
      card: 'summary_large_image',
      description: data.product.description,
      title: data.product.name,
    },
  };
}
