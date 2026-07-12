import { describe, expect, it } from 'vitest';

import {
  ApiError,
  apiErrorFromResponse,
  normalizeApiError,
} from '@/lib/api/error';

describe('API error normalization', () => {
  it('preserves normalized errors', () => {
    const error = new ApiError('Conflict', { code: 'INVENTORY_CONFLICT' });
    expect(normalizeApiError(error)).toBe(error);
  });

  it('maps fetch failures without exposing the raw message', () => {
    const error = normalizeApiError(new TypeError('secret upstream detail'));
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).not.toContain('secret');
    expect(error.retryable).toBe(true);
  });

  it('distinguishes timeout failures', () => {
    const error = normalizeApiError(
      new DOMException('timed out', 'TimeoutError'),
    );
    expect(error.code).toBe('TIMEOUT');
    expect(error.retryable).toBe(true);
  });

  it('maps HTTP status and propagates safe request IDs', () => {
    const response = new Response(null, {
      headers: { 'x-request-id': 'request-1' },
      status: 429,
    });
    const error = apiErrorFromResponse(response);
    expect(error).toMatchObject({
      code: 'RATE_LIMITED',
      requestId: 'request-1',
      retryable: true,
      status: 429,
    });
  });
});
