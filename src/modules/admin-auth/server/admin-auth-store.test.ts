import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  ADMIN_SESSION_COOKIE_NAME,
  authenticateDemoAdmin,
  clearAdminSessionCookie,
  endAdminSession,
  getAdminSession,
} from './admin-auth-store';

function cookies(value?: string) {
  return {
    get: (name: string) =>
      name === ADMIN_SESSION_COOKIE_NAME && value ? { value } : undefined,
  };
}

function tokenFrom(cookie: string) {
  return cookie.match(/lyle_admin_session=([^;]+)/)?.[1] ?? '';
}

describe('development admin auth adapter', () => {
  let token = '';
  beforeEach(() => {
    token = tokenFrom(
      authenticateDemoAdmin('admin@lyle.vn', 'LyleAdmin!2026').cookie,
    );
  });

  it('returns a server-owned session with role permissions attached', () => {
    const session = getAdminSession(cookies(token));
    expect(session?.adminUserId).toBe('admin_demo');
    expect(session?.role).toBe('SUPER_ADMIN');
    expect(session?.permissions).toContain('product.publish');
  });

  it('uses generic login failures', () =>
    expect(() =>
      authenticateDemoAdmin('unknown@example.com', 'incorrect-password'),
    ).toThrow('Không thể đăng nhập'));

  it('does not accept a customer session cookie name', () => {
    const customerStyleCookies = {
      get: (name: string) =>
        name === 'lyle_session' && token ? { value: token } : undefined,
    };
    expect(getAdminSession(customerStyleCookies)).toBeNull();
  });

  it('clears the session cookie on logout without throwing', () => {
    expect(() => endAdminSession(cookies(token))).not.toThrow();
    expect(clearAdminSessionCookie()).toContain('Max-Age=0');
  });

  it('returns null for an unknown token', () => {
    expect(getAdminSession(cookies('not-a-real-token'))).toBeNull();
  });
});
