export type JsonLdPrimitive = boolean | number | string | null;
export type JsonLdValue =
  | JsonLdPrimitive
  | JsonLdValue[]
  | { readonly [key: string]: JsonLdValue | undefined };

export type BreadcrumbListJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    item: string;
    name: string;
    position: number;
  }>;
};

export type ProductJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Product';
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  description?: string;
  image?: string[];
  name: string;
  offers?: {
    '@type': 'Offer';
    availability?: string;
    itemCondition?: string;
    price: string;
    priceCurrency: 'VND';
    url: string;
  };
  sku?: string;
  url?: string;
};

export type OrganizationJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
};

export type WebSiteJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  description?: string;
  name: string;
  url: string;
};

export type ArticleJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  dateModified?: string;
  datePublished: string;
  headline: string;
};

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: item.url,
      name: item.name,
      position: index + 1,
    })),
  };
}

export function createOrganizationJsonLd(input: {
  name: string;
  url: string;
}): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
  };
}

export function createWebSiteJsonLd(input: {
  description?: string;
  name: string;
  url: string;
}): WebSiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: input.description,
    name: input.name,
    url: input.url,
  };
}

export function serializeJsonLd(value: JsonLdValue) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
