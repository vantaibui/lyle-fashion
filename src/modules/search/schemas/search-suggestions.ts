import { z } from 'zod';

import { searchSuggestionKinds } from '@/modules/search/contracts/search-suggestions';

export const searchSuggestionSchema = z.object({
  detail: z.string().trim().max(160).optional(),
  href: z.string().startsWith('/'),
  id: z.string().trim().min(1).max(120),
  kind: z.enum(searchSuggestionKinds),
  label: z.string().trim().min(1).max(160),
});

export const searchSuggestionResultSchema = z.object({
  categories: z.array(searchSuggestionSchema),
  collections: z.array(searchSuggestionSchema),
  keywords: z.array(searchSuggestionSchema),
  products: z.array(searchSuggestionSchema),
});
