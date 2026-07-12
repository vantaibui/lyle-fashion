import { NextResponse } from 'next/server';

import { forgotPasswordSchema } from '@/modules/auth/schemas/auth';

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { message: 'Thông tin chưa hợp lệ.' },
      { status: 400 },
    );
  return NextResponse.json({
    message:
      'Nếu email thuộc một tài khoản, hướng dẫn đặt lại mật khẩu sẽ được gửi.',
  });
}
