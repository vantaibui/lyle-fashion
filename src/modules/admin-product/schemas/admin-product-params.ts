import { z } from 'zod';

export const adminProductParamsSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export type AdminProductParams = z.infer<typeof adminProductParamsSchema>;
