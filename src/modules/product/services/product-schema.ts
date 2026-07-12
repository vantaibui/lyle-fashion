import type { ProductJsonLd } from '@/lib/seo/json-ld';
import { canonicalUrl } from '@/lib/seo/url';
import type { ProductPageData } from '@/modules/product/contracts/product';

export function createProductJsonLd(data: ProductPageData): ProductJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    brand: {
      '@type': 'Brand',
      name: 'LYLE Fashion',
    },
    description: data.product.description,
    image: (
      data.selection.selectedSku?.images ?? data.product.defaultGallery
    ).map((image) => canonicalUrl(image.src)),
    name: data.product.name,
    offers:
      data.product.status === 'published'
        ? {
            '@type': 'Offer',
            availability:
              data.selection.selectedSku?.available === false ||
              data.product.stockLevel === 'out-of-stock'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            price: String(
              data.selection.selectedSku?.price ??
                data.product.bundle?.price ??
                data.product.skus[0]?.price ??
                0,
            ),
            priceCurrency: 'VND',
            url: canonicalUrl(`/product/${data.product.slug}`),
          }
        : undefined,
    sku: data.selection.selectedSku?.code,
    url: canonicalUrl(`/product/${data.product.slug}`),
  };
}
