import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/error';
import type { SearchSuggestionProvider } from '@/modules/search/contracts/search-suggestions';

import { useSearchSuggestions } from './use-search-suggestions';

const emptyData = {
  products: [],
  categories: [],
  collections: [],
  keywords: [],
};

afterEach(() => vi.useRealTimers());

describe('useSearchSuggestions', () => {
  it('does not request below the minimum query length', async () => {
    vi.useFakeTimers();
    const provider = vi.fn<SearchSuggestionProvider>();
    renderHook(() =>
      useSearchSuggestions({
        debounceMs: 200,
        minimumQueryLength: 2,
        provider,
        query: 'l',
      }),
    );
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(provider).not.toHaveBeenCalled();
  });

  it('debounces requests', async () => {
    vi.useFakeTimers();
    const provider = vi.fn<SearchSuggestionProvider>().mockResolvedValue({
      data: emptyData,
      error: null,
    });
    const { rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions({
          debounceMs: 200,
          minimumQueryLength: 2,
          provider,
          query,
        }),
      { initialProps: { query: 'li' } },
    );
    rerender({ query: 'linen' });
    await act(() => vi.advanceTimersByTimeAsync(199));
    expect(provider).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(provider).toHaveBeenCalledTimes(1);
    expect(provider).toHaveBeenCalledWith('linen', expect.any(Object));
  });

  it('ignores stale responses from an older query', async () => {
    vi.useFakeTimers();
    let resolveFirst:
      | ((value: Awaited<ReturnType<SearchSuggestionProvider>>) => void)
      | undefined;
    const provider = vi
      .fn<SearchSuggestionProvider>()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce({
        data: {
          ...emptyData,
          keywords: [
            {
              id: 'new',
              kind: 'keyword',
              label: 'Linen mới',
              href: '/search?q=linen',
            },
          ],
        },
        error: null,
      });
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions({
          debounceMs: 1,
          minimumQueryLength: 2,
          provider,
          query,
        }),
      { initialProps: { query: 'li' } },
    );
    await act(() => vi.advanceTimersByTimeAsync(1));
    rerender({ query: 'linen' });
    await act(() => vi.advanceTimersByTimeAsync(1));
    await act(async () => {
      resolveFirst?.({
        data: {
          ...emptyData,
          keywords: [
            { id: 'old', kind: 'keyword', label: 'Cũ', href: '/search?q=old' },
          ],
        },
        error: null,
      });
      await Promise.resolve();
    });
    expect(result.current.result.keywords[0]?.id).toBe('new');
  });

  it('exposes provider failures', async () => {
    vi.useFakeTimers();
    const provider = vi.fn<SearchSuggestionProvider>().mockResolvedValue({
      data: null,
      error: new ApiError('Không thể tìm kiếm.', { code: 'NETWORK_ERROR' }),
    });
    const { result } = renderHook(() =>
      useSearchSuggestions({
        debounceMs: 1,
        minimumQueryLength: 2,
        provider,
        query: 'linen',
      }),
    );
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current.status).toBe('error');
    expect(result.current.error?.code).toBe('NETWORK_ERROR');
  });
});
