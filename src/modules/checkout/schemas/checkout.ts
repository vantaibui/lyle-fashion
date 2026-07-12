import { z } from 'zod';

import { shippingAddressSchema } from '@/modules/customer/schemas/address';
import { paymentMethodTypes } from '@/modules/payment/contracts/payment';

export const checkoutInputSchema = z.object({
  acceptedTerms: z.literal(true),
  address: shippingAddressSchema,
  contact: z.object({
    email: z.email().trim().max(160),
    fullName: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .regex(
        /^(0|\+84)(3|5|7|8|9)\d{8}$/,
        'Số điện thoại chưa đúng định dạng.',
      ),
  }),
  deliveryNote: z.string().trim().max(240).optional(),
  paymentMethod: z.enum(paymentMethodTypes),
  shippingMethod: z.enum(['express', 'pickup', 'standard']),
});
