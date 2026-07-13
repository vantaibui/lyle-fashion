import { z } from 'zod';

import { catalogSortValues } from '@/lib/validation/search-params';
import {
  catalogFilterKeys,
  catalogGenders,
  productBadgeKinds,
  stockLevels,
} from '@/modules/catalog/contracts/catalog';

export const catalogImageSchema = z.object({
  alt: z.string().trim().min(1).max(200),
  height: z.number().int().positive(),
  src: z.string().min(1),
  width: z.number().int().positive(),
});

export const productBadgeSchema = z.object({
  id: z.string().trim().min(1).max(120),
  kind: z.enum(productBadgeKinds),
  label: z.string().trim().min(1).max(80),
});

export const productCardColorOptionSchema = z.object({
  colorId: z.string().trim().min(1).max(120),
  image: catalogImageSchema,
  label: z.string().trim().min(1).max(80),
  swatchHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const productCardSizeOptionSchema = z.object({
  available: z.boolean(),
  label: z.string().trim().min(1).max(20),
  skuId: z.string().trim().min(1).max(120),
  sizeId: z.string().trim().min(1).max(120),
});

export const productSummarySchema = z.object({
  badges: z.array(productBadgeSchema),
  categoryId: z.string().trim().min(1).max(120),
  colors: z.array(productCardColorOptionSchema),
  compareAtPrice: z.number().int().nonnegative().optional(),
  discountPercentageAllowed: z.boolean().optional(),
  gender: z.enum(catalogGenders),
  id: z.string().trim().min(1).max(120),
  isBundle: z.boolean().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  materialLabel: z.string().trim().min(1).max(120).optional(),
  name: z.string().trim().min(1).max(200),
  price: z.number().int().nonnegative(),
  primaryImage: catalogImageSchema,
  requiresSizeSelection: z.boolean(),
  sizes: z.array(productCardSizeOptionSchema),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  stockLevel: z.enum(stockLevels),
});

export const catalogLandingContentSchema = z.object({
  breadcrumbLabel: z.string().trim().min(1).max(80),
  campaignImage: catalogImageSchema.optional(),
  description: z.string().trim().max(600).optional(),
  id: z.string().trim().min(1).max(120),
  seoDescription: z.string().trim().min(1).max(300),
  slug: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160),
});

export const catalogFilterOptionSchema = z.object({
  count: z.number().int().nonnegative().optional(),
  disabled: z.boolean().optional(),
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(120),
});

export const catalogFilterFacetSchema = z.object({
  key: z.enum(catalogFilterKeys),
  label: z.string().trim().min(1).max(80),
  options: z.array(catalogFilterOptionSchema),
});

export const catalogSortOptionSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.enum(catalogSortValues),
});

export const catalogPaginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const catalogResultSchema = z.object({
  facets: z.array(catalogFilterFacetSchema),
  pagination: catalogPaginationSchema,
  products: z.array(productSummarySchema),
  sortOptions: z.array(catalogSortOptionSchema),
});
