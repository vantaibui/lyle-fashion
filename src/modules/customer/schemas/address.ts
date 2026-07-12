import { z } from 'zod';

export const shippingAddressSchema = z.object({
  districtCode: z.string().trim().min(1).max(40),
  districtName: z.string().trim().min(1).max(120),
  email: z.email().trim().max(160),
  fullName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Số điện thoại chưa đúng định dạng.'),
  provinceCode: z.string().trim().min(1).max(40),
  provinceName: z.string().trim().min(1).max(120),
  streetAddress: z.string().trim().min(4).max(240),
  wardCode: z.string().trim().min(1).max(40),
  wardName: z.string().trim().min(1).max(120),
});
