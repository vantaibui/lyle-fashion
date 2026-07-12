'use client';

import { useEffect, useRef, useState } from 'react';

import type { ApiError } from '@/lib/api/error';
import type {
  SearchSuggestionProvider,
  SearchSuggestionResult,
} from '@/modules/search/contracts/search-suggestions';
import { normalizeSearchQuery } from '@/modules/search/utils/normalize-query';

const emptyResult: SearchSuggestionResult = {
  categories: [],
  collections: [],
  keywords: [],
  products: [],
};

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

type UseSearchSuggestionsOptions = {
  debounceMs: number;
  enabled?: boolean;
  minimumQueryLength: number;
  provider: SearchSuggestionProvider;
  query: string;
};

export function useSearchSuggestions({
  debounceMs,
  enabled = true,
  minimumQueryLength,
  provider,
  query,
}: UseSearchSuggestionsOptions) {
  const normalizedQuery = normalizeSearchQuery(query);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<SearchSuggestionResult>(emptyResult);
  const [resolvedQuery, setResolvedQuery] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const requestSequence = useRef(0);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    if (!enabled || normalizedQuery.length < minimumQueryLength) {
      return;
    }

    let controller: AbortController | undefined;
    const timer = window.setTimeout(() => {
      controller = new AbortController();
      setError(null);
      setStatus('loading');

      void provider(normalizedQuery, { signal: controller.signal }).then(
        (response) => {
          if (sequence !== requestSequence.current) return;
          if (response.error) {
            setError(response.error);
            setResult(emptyResult);
            setResolvedQuery(normalizedQuery);
            setStatus('error');
            return;
          }
          setResult(response.data);
          setResolvedQuery(normalizedQuery);
          setStatus('success');
        },
      );
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      controller?.abort();
    };
  }, [
    debounceMs,
    enabled,
    minimumQueryLength,
    normalizedQuery,
    provider,
    retryKey,
  ]);

  const isBelowMinimum =
    !enabled || normalizedQuery.length < minimumQueryLength;
  const isCurrent = resolvedQuery === normalizedQuery;

  return {
    error: isCurrent ? error : null,
    normalizedQuery,
    result: isCurrent ? result : emptyResult,
    retry: () => {
      setStatus('loading');
      setRetryKey((value) => value + 1);
    },
    status: isBelowMinimum ? 'idle' : isCurrent ? status : 'loading',
  };
}
