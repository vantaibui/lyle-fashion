import { browserApiRequest } from '@/lib/api/browser-client';
import { ApiError } from '@/lib/api/error';
import type { SearchSuggestionProvider } from '@/modules/search/contracts/search-suggestions';
import { searchSuggestionResultSchema } from '@/modules/search/schemas/search-suggestions';
import { normalizeSearchQuery } from '@/modules/search/utils/normalize-query';

export const searchSuggestionApi: SearchSuggestionProvider = async (
  query,
  { signal },
) => {
  const normalized = normalizeSearchQuery(query);
  const response = await browserApiRequest<unknown>(
    `/api/search/suggestions?${new URLSearchParams({ q: normalized })}`,
    { retries: 1, signal, timeoutMs: 4_000 },
  );

  if (response.error) return response;
  const parsed = searchSuggestionResultSchema.safeParse(response.data);
  if (!parsed.success) {
    return {
      data: null,
      error: new ApiError('Dữ liệu gợi ý tìm kiếm không hợp lệ.', {
        code: 'UNEXPECTED_SERVER_ERROR',
      }),
    };
  }

  return { data: parsed.data, error: null };
};
