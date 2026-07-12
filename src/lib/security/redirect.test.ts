import { describe, expect, it } from 'vitest';

import { getSafeRedirect } from '@/lib/security/redirect';

describe('safe redirects', () => {
  it('keeps same-origin relative paths', () => {
    expect(getSafeRedirect('/account/orders?page=2')).toBe(
      '/account/orders?page=2',
    );
  });

  it.each(['https://attacker.test', '//attacker.test', 'javascript:alert(1)'])(
    'rejects external candidate %s',
    (candidate) => {
      expect(getSafeRedirect(candidate)).toBe('/');
    },
  );
});
