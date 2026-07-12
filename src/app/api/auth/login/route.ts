import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { authenticateDemoAccount } from '@/modules/account/server/account-store';
import { loginSchema } from '@/modules/auth/schemas/auth';
import { safeReturnUrl } from '@/modules/auth/utils/safe-return-url';

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { message: 'Thông tin đăng nhập chưa hợp lệ.' },
      { status: 400 },
    );
  try {
    const result = authenticateDemoAccount(
      parsed.data.email,
      parsed.data.password,
    );
    const response = NextResponse.json({
      profile: result.profile,
      returnTo: safeReturnUrl(parsed.data.returnTo),
    });
    response.headers.append('set-cookie', result.cookie);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch (error) {
    const status = error instanceof ApiError ? (error.status ?? 401) : 500;
    return NextResponse.json(
      { message: 'Không thể đăng nhập với thông tin đã cung cấp.' },
      { status },
    );
  }
}
