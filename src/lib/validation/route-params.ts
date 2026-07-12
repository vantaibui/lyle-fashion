import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(slugPattern, 'Slug must use lowercase URL-safe segments.');

export const collectionParamsSchema = z.object({ slug: slugSchema });
export const productParamsSchema = z.object({ slug: slugSchema });
export const journalParamsSchema = z.object({ slug: slugSchema });
export const accountOrderParamsSchema = z.object({
  orderId: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export type CollectionParams = z.infer<typeof collectionParamsSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type JournalParams = z.infer<typeof journalParamsSchema>;
