import { describe, expect, it } from 'vitest';

import { safeReturnUrl } from './safe-return-url';

describe('safeReturnUrl', () => {
  it('keeps local paths and query state', () => {
    expect(safeReturnUrl('/account/orders?page=2')).toBe(
      '/account/orders?page=2',
    );
  });

  it.each(['https://evil.example', '//evil.example', '/login', undefined])(
    'rejects unsafe value %s',
    (value) => expect(safeReturnUrl(value)).toBe('/account'),
  );
});
