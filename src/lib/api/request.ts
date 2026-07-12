import { apiErrorFromResponse, normalizeApiError } from '@/lib/api/error';
import type { ApiResult } from '@/lib/api/result';

type ApiRequestOptions = Omit<RequestInit, 'signal'> & {
  requestId?: string;
  retries?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
};

const retryableMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

function createSignal(signal: AbortSignal | undefined, timeoutMs: number) {
  return signal
    ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs);
}

export async function apiRequest<TData>(
  input: string | URL,
  options: ApiRequestOptions = {},
): Promise<ApiResult<TData>> {
  const {
    headers,
    method = 'GET',
    requestId,
    retries = 0,
    signal,
    timeoutMs = 10_000,
    ...init
  } = options;
  const normalizedMethod = method.toUpperCase();
  const attempts = retryableMethods.has(normalizedMethod) ? retries + 1 : 1;
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');
  if (requestId) requestHeaders.set('x-request-id', requestId);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(input, {
        ...init,
        headers: requestHeaders,
        method: normalizedMethod,
        signal: createSignal(signal, timeoutMs),
      });
      const requestId = response.headers.get('x-request-id') ?? undefined;

      if (!response.ok) {
        const error = apiErrorFromResponse(response);
        if (error.retryable && attempt + 1 < attempts) continue;
        return { data: null, error, requestId };
      }

      if (response.status === 204) {
        return { data: undefined as TData, error: null, requestId };
      }

      return {
        data: (await response.json()) as TData,
        error: null,
        requestId,
      };
    } catch (error) {
      const normalized = normalizeApiError(error);
      if (normalized.retryable && attempt + 1 < attempts) continue;
      return { data: null, error: normalized };
    }
  }

  return { data: null, error: normalizeApiError(undefined) };
}
