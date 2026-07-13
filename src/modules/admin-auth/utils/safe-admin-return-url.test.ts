import { describe, expect, it } from 'vitest';

import { safeAdminReturnUrl } from './safe-admin-return-url';

describe('safeAdminReturnUrl', () => {
  it('keeps local admin paths and query state', () => {
    expect(safeAdminReturnUrl('/admin/products?page=2')).toBe(
      '/admin/products?page=2',
    );
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/admin/login',
    '/account',
    undefined,
  ])('rejects unsafe value %s', (value) => {
    expect(safeAdminReturnUrl(value)).toBe('/admin');
  });
});
