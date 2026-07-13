import { z } from 'zod';

import {
  adminFulfillmentStatuses,
  adminOrderStatuses,
  adminPaymentStatuses,
} from '@/modules/admin-order/contracts/admin-order';

const stringValue = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value[0] : value));
const pageValue = z.preprocess((value) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  return typeof normalized === 'string' ? Number(normalized) : normalized;
}, z.number().int().positive());

export const adminOrderSearchParamsSchema = z.object({
  fulfillmentStatus: stringValue
    .pipe(z.enum(adminFulfillmentStatuses))
    .optional()
    .catch(undefined),
  orderStatus: stringValue
    .pipe(z.enum(adminOrderStatuses))
    .optional()
    .catch(undefined),
  page: pageValue.optional().catch(1),
  paymentStatus: stringValue
    .pipe(z.enum(adminPaymentStatuses))
    .optional()
    .catch(undefined),
  q: stringValue
    .pipe(
      z
        .string()
        .trim()
        .max(100)
        .regex(/^[A-Za-z0-9_-]+$/),
    )
    .optional()
    .catch(undefined),
});

export type AdminOrderSearchState = z.infer<
  typeof adminOrderSearchParamsSchema
>;
export type SearchParamRecord = Record<string, string | string[] | undefined>;

export function parseAdminOrderSearchParams(params: SearchParamRecord) {
  return adminOrderSearchParamsSchema.parse(params);
}
