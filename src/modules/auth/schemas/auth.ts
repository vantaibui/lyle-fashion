import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email chưa đúng định dạng.').trim().max(160),
  password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự.').max(128),
  returnTo: z.string().max(500).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Email chưa đúng định dạng.').trim().max(160),
});
