import { describe, expect, it } from 'vitest';

import {
  parseProductSearchParams,
  serializeProductSearchParams,
} from '@/lib/validation/search-params';

describe('product search parameters', () => {
  it('normalizes invalid pagination and sorting', () => {
    expect(
      parseProductSearchParams({ page: '-4', sort: 'unknown' }),
    ).toMatchObject({
      page: 1,
      sort: 'relevance',
    });
  });

  it('preserves repeated filters', () => {
    expect(
      parseProductSearchParams({ color: ['ivory', 'black'] }).color,
    ).toEqual(['ivory', 'black']);
  });

  it('serializes in stable order and omits defaults', () => {
    expect(
      serializeProductSearchParams({
        color: ['sand', 'black'],
        page: 1,
        sort: 'relevance',
      }),
    ).toBe('color=black&color=sand');
  });

  it('drops unsafe filter values', () => {
    expect(
      parseProductSearchParams({ material: ['linen', '../private'] }).material,
    ).toBeUndefined();
  });

  it('supports every approved catalog filter in stable order', () => {
    expect(
      serializeProductSearchParams({
        availability: ['in-stock'],
        category: ['shirts'],
        gender: ['women'],
        material: ['linen'],
        page: 2,
        sort: 'newest',
      }),
    ).toBe(
      'availability=in-stock&category=shirts&gender=women&material=linen&page=2&sort=newest',
    );
  });
});
