import type { ApiError } from '@/lib/api/error';

export const searchSuggestionKinds = [
  'product',
  'category',
  'collection',
  'keyword',
] as const;

export type SearchSuggestionKind = (typeof searchSuggestionKinds)[number];

export type SearchSuggestion = {
  detail?: string;
  href: string;
  id: string;
  kind: SearchSuggestionKind;
  label: string;
};

export type SearchSuggestionResult = {
  categories: SearchSuggestion[];
  collections: SearchSuggestion[];
  keywords: SearchSuggestion[];
  products: SearchSuggestion[];
};

export type SearchSuggestionProvider = (
  query: string,
  options: { signal: AbortSignal },
) => Promise<
  | { data: SearchSuggestionResult; error: null }
  | { data: null; error: ApiError }
>;
