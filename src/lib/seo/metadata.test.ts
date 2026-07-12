import { describe, expect, it } from 'vitest';

import { createRouteMetadata } from '@/lib/seo/metadata';
import { canonicalUrl } from '@/lib/seo/url';

describe('SEO URL and metadata helpers', () => {
  it('creates an absolute canonical without query or hash', () => {
    expect(canonicalUrl('/shop?page=2#products')).toBe(
      'http://localhost:3000/shop',
    );
  });

  it('normalizes trailing slashes away from canonical URLs', () => {
    expect(canonicalUrl('/shop/')).toBe('http://localhost:3000/shop');
  });

  it('keeps route metadata non-indexable by default', () => {
    const metadata = createRouteMetadata({
      description: 'Mô tả',
      pathname: '/shop',
      title: 'Cửa hàng',
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
