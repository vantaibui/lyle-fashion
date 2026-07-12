import { z } from 'zod';

export const simpleCartLineInputSchema = z.object({
  lineType: z.literal('simple').optional(),
  productId: z.string().trim().min(1).max(120),
  quantity: z.int().min(1).max(5),
  skuId: z.string().trim().min(1).max(160),
});

export const bundleCartLineComponentInputSchema = z.object({
  componentId: z.string().trim().min(1).max(120),
  productId: z.string().trim().min(1).max(120),
  sizeId: z.string().trim().min(1).max(80),
  skuId: z.string().trim().min(1).max(160),
});

export const bundleCartLineInputSchema = z.object({
  bundleId: z.string().trim().min(1).max(120),
  components: z.array(bundleCartLineComponentInputSchema).min(1).max(8),
  lineType: z.literal('bundle'),
  productId: z.string().trim().min(1).max(120),
  quantity: z.int().min(1).max(2),
});

export const cartLineIntentInputSchema = z.union([
  simpleCartLineInputSchema,
  bundleCartLineInputSchema,
]);
