import { z } from 'zod';

const stringValue = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value[0] : value));
const pageValue = z.preprocess((value) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  return typeof normalized === 'string' ? Number(normalized) : normalized;
}, z.number().int().positive());

export const adminProductStatusValues = [
  'draft',
  'published',
  'archived',
] as const;
export const adminProductSortValues = [
  'updated-desc',
  'name-asc',
  'name-desc',
] as const;

export const adminProductSearchParamsSchema = z.object({
  category: stringValue
    .pipe(z.string().trim().max(120))
    .optional()
    .catch(undefined),
  collection: stringValue
    .pipe(z.string().trim().max(120))
    .optional()
    .catch(undefined),
  material: stringValue
    .pipe(z.string().trim().max(120))
    .optional()
    .catch(undefined),
  page: pageValue.optional().catch(1),
  q: stringValue.pipe(z.string().trim().max(120)).optional().catch(undefined),
  sort: stringValue
    .pipe(z.enum(adminProductSortValues))
    .optional()
    .catch('updated-desc'),
  status: stringValue
    .pipe(z.enum(adminProductStatusValues))
    .optional()
    .catch(undefined),
});

export type AdminProductSearchState = z.infer<
  typeof adminProductSearchParamsSchema
>;
export type SearchParamRecord = Record<string, string | string[] | undefined>;

export function parseAdminProductSearchParams(params: SearchParamRecord) {
  return adminProductSearchParamsSchema.parse(params);
}
