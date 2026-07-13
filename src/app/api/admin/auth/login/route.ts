import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { adminLoginSchema } from '@/modules/admin-auth/schemas/admin-auth';
import { authenticateDemoAdmin } from '@/modules/admin-auth/server/admin-auth-store';
import { safeAdminReturnUrl } from '@/modules/admin-auth/utils/safe-admin-return-url';

export async function POST(request: Request) {
  const parsed = adminLoginSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { message: 'Thông tin đăng nhập chưa hợp lệ.' },
      { status: 400 },
    );

  try {
    const result = authenticateDemoAdmin(
      parsed.data.email,
      parsed.data.password,
    );
    const response = NextResponse.json({
      returnTo: safeAdminReturnUrl(parsed.data.returnTo),
      session: {
        adminUserId: result.session.adminUserId,
        role: result.session.role,
      },
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
