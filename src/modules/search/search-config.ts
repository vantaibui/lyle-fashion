import { mockSearchSuggestionAdapter } from '@/modules/search/api/mock-search-suggestion-adapter';

export const searchConfig = {
  debounceMs: 250,
  minimumQueryLength: 2,
  provider: mockSearchSuggestionAdapter,
  popularSearches: [
    'Áo sơ mi Linen',
    'Quần Linen',
    'Bộ sưu tập Linen',
    'Hàng mới',
    'Bán chạy',
  ],
} as const;
