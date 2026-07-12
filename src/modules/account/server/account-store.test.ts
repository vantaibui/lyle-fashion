import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { ApiError } from '@/lib/api/error';
import {
  authenticateDemoAccount,
  createReturn,
  getOrder,
  getOrders,
  getSession,
  SESSION_COOKIE_NAME,
  trackGuestOrder,
} from './account-store';

function cookies(value?: string) {
  return {
    get: (name: string) =>
      name === SESSION_COOKIE_NAME && value ? { value } : undefined,
  };
}

function tokenFrom(cookie: string) {
  return cookie.match(/lyle_session=([^;]+)/)?.[1] ?? '';
}

describe('development account adapter', () => {
  let token = '';
  beforeEach(() => {
    token = tokenFrom(
      authenticateDemoAccount('demo@lyle.vn', 'LyleDemo!2026').cookie,
    );
  });

  it('returns a server-owned session', () =>
    expect(getSession(cookies(token))?.customerId).toBe('customer_demo'));
  it('uses generic login failures', () =>
    expect(() =>
      authenticateDemoAccount('unknown@example.com', 'incorrect-password'),
    ).toThrow('Không thể đăng nhập'));
  it('protects order history', () =>
    expect(() => getOrders(cookies())).toThrow(ApiError));
  it('does not expose another order id', () =>
    expect(() => getOrder(cookies(token), 'unknown')).toThrow(
      'Không tìm thấy',
    ));
  it('tracks with both public-safe identifiers', () =>
    expect(trackGuestOrder('LYLE-DEMO-2401', '0901234567').code).toBe(
      'LYLE-DEMO-2401',
    ));
  it('returns a generic tracking failure', () =>
    expect(() => trackGuestOrder('LYLE-DEMO-2401', '0000000000')).toThrow(
      'Không thể xác minh',
    ));
  it('validates return quantities against the owned order line', () =>
    expect(() =>
      createReturn(cookies(token), {
        orderId: 'LYLE-DEMO-2401',
        quantity: 2,
        reasonCode: 'wrong_size',
        skuId: 'sku-linen-natural-m',
      }),
    ).toThrow('chưa đủ điều kiện'));
});
