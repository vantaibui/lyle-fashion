import { describe, expect, it } from 'vitest';

import { createBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';

describe('JSON-LD serialization', () => {
  it('escapes characters that could terminate a script element', () => {
    const serialized = serializeJsonLd({
      '@context': 'https://schema.org',
      name: '</script><script>alert(1)</script>',
    });
    expect(serialized).not.toContain('<');
    expect(serialized).toContain('\\u003c/script\\u003e');
  });
});

describe('breadcrumb structured data', () => {
  it('uses sequential positions and supplied canonical URLs', () => {
    const data = createBreadcrumbJsonLd([
      { name: 'Trang chủ', url: 'https://example.com/' },
      { name: 'Cửa hàng', url: 'https://example.com/shop' },
    ]);
    expect(data.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(data.itemListElement[1]?.item).toBe('https://example.com/shop');
  });
});
