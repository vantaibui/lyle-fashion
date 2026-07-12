import { z } from 'zod';

const vietnamPhone = z
  .string()
  .trim()
  .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Số điện thoại chưa đúng định dạng.');

export const customerProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ tên.').max(120),
  phone: vietnamPhone,
  preferences: z.object({
    marketingEmail: z.boolean(),
    marketingSms: z.boolean(),
    newCollections: z.boolean(),
  }),
});

export const customerAddressSchema = z.object({
  deliveryNote: z.string().trim().max(240).optional(),
  districtCode: z.string().trim().min(1).max(40),
  districtName: z.string().trim().min(1).max(120),
  fullName: z.string().trim().min(1).max(120),
  phone: vietnamPhone,
  provinceCode: z.string().trim().min(1).max(40),
  provinceName: z.string().trim().min(1).max(120),
  streetAddress: z.string().trim().min(4).max(240),
  wardCode: z.string().trim().min(1).max(40),
  wardName: z.string().trim().min(1).max(120),
  isDefaultShipping: z.boolean().default(false),
});
