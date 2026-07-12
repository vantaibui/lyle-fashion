import { z } from 'zod';

const stringValue = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value[0] : value));
const multiValue = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value : [value]))
  .pipe(
    z.array(
      z
        .string()
        .trim()
        .min(1)
        .max(120)
        .regex(/^[a-zA-Z0-9_-]+$/),
    ),
  );
const pageValue = z.preprocess((value) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  return typeof normalized === 'string' ? Number(normalized) : normalized;
}, z.number().int().positive());

export const catalogSortValues = [
  'relevance',
  'recommended',
  'newest',
  'price-asc',
  'price-desc',
  'best-selling',
] as const;

export const productSearchParamsSchema = z.object({
  availability: multiValue.optional().catch(undefined),
  category: multiValue.optional().catch(undefined),
  collection: multiValue.optional().catch(undefined),
  color: multiValue.optional().catch(undefined),
  gender: multiValue.optional().catch(undefined),
  material: multiValue.optional().catch(undefined),
  page: pageValue.optional().catch(1),
  priceTier: multiValue.optional().catch(undefined),
  promotion: multiValue.optional().catch(undefined),
  q: stringValue.pipe(z.string().trim().max(120)).optional().catch(undefined),
  size: multiValue.optional().catch(undefined),
  sort: stringValue
    .pipe(z.enum(catalogSortValues))
    .optional()
    .catch('relevance'),
  style: multiValue.optional().catch(undefined),
  variant: stringValue
    .pipe(z.string().trim().max(100))
    .optional()
    .catch(undefined),
});

export const campaignSearchParamsSchema = z.object({
  utm_campaign: stringValue.pipe(z.string().trim().max(100)).optional(),
  utm_medium: stringValue.pipe(z.string().trim().max(100)).optional(),
  utm_source: stringValue.pipe(z.string().trim().max(100)).optional(),
});

export const orderTrackingSchema = z.object({
  email: z.email().optional(),
  orderReference: z.string().trim().min(4).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{9,15}$/)
    .optional(),
});

export type ProductSearchState = z.infer<typeof productSearchParamsSchema>;
export type SearchParamRecord = Record<string, string | string[] | undefined>;

export function parseProductSearchParams(params: SearchParamRecord) {
  return productSearchParamsSchema.parse(params);
}

export function serializeProductSearchParams(state: ProductSearchState) {
  const params = new URLSearchParams();
  const entries: Array<[string, string | string[] | number | undefined]> = [
    ['availability', state.availability],
    ['category', state.category],
    ['collection', state.collection],
    ['color', state.color],
    ['gender', state.gender],
    ['material', state.material],
    ['page', state.page === 1 ? undefined : state.page],
    ['priceTier', state.priceTier],
    ['promotion', state.promotion],
    ['q', state.q],
    ['size', state.size],
    ['sort', state.sort === 'relevance' ? undefined : state.sort],
    ['style', state.style],
    ['variant', state.variant],
  ];

  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      for (const item of [...value].sort()) params.append(key, item);
    } else if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  params.sort();
  return params.toString();
}
