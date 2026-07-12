import { z } from 'zod';

export const returnRequestSchema = z.object({
  note: z.string().trim().max(500).optional(),
  orderId: z.string().min(1).max(100),
  quantity: z.coerce.number().int().min(1).max(5),
  reasonCode: z.enum([
    'wrong_size',
    'not_expected',
    'damaged',
    'wrong_item',
    'quality',
    'other',
  ]),
  skuId: z.string().min(1).max(100),
});
