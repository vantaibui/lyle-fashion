import { describe, expect, it } from 'vitest';

import { parseAdminProductSearchParams } from './admin-product-search-params';

describe('parseAdminProductSearchParams', () => {
  it('leaves sort and page undefined when absent', () => {
    const result = parseAdminProductSearchParams({});
    expect(result.sort).toBeUndefined();
    expect(result.page).toBeUndefined();
  });

  it('falls back to the default sort for an invalid value', () => {
    const result = parseAdminProductSearchParams({ sort: 'not-a-sort' });
    expect(result.sort).toBe('updated-desc');
  });

  it('parses a valid status and page', () => {
    const result = parseAdminProductSearchParams({
      page: '2',
      status: 'draft',
    });
    expect(result.page).toBe(2);
    expect(result.status).toBe('draft');
  });

  it('falls back to undefined for an invalid status', () => {
    const result = parseAdminProductSearchParams({ status: 'not-a-status' });
    expect(result.status).toBeUndefined();
  });
});
