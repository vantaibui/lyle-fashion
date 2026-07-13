import { z } from 'zod';

export const adminOrderParamsSchema = z.object({
  orderId: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[A-Za-z0-9_-]+$/),
});

export type AdminOrderParams = z.infer<typeof adminOrderParamsSchema>;
