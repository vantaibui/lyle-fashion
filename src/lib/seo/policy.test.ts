import { describe, expect, it } from 'vitest';

import {
  createRobotsDirectives,
  isIndexingEnabled,
  isPreviewLikeOrigin,
} from '@/lib/seo/policy';

describe('seo policy', () => {
  it('treats localhost and Vercel preview hosts as non-indexable', () => {
    expect(isPreviewLikeOrigin('http://localhost:3000')).toBe(true);
    expect(isPreviewLikeOrigin('https://lyle-preview.vercel.app')).toBe(true);
    expect(isPreviewLikeOrigin('https://lylefashion.vn')).toBe(false);
  });

  it('requires both explicit enablement and a non-preview origin', () => {
    expect(
      isIndexingEnabled({
        explicitFlag: false,
        siteUrl: 'https://lylefashion.vn',
      }),
    ).toBe(false);
    expect(
      isIndexingEnabled({
        explicitFlag: true,
        siteUrl: 'http://localhost:3000',
      }),
    ).toBe(false);
  });

  it('adds nocache on noindex routes', () => {
    expect(createRobotsDirectives(false)).toEqual({
      follow: false,
      index: false,
      nocache: true,
    });
  });
});
