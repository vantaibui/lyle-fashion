import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { updateProfile } from '@/modules/account/server/account-store';
import { customerProfileSchema } from '@/modules/customer/schemas/customer';

export async function PATCH(request: Request) {
  const parsed = customerProfileSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        message: 'Hồ sơ chưa hợp lệ.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { profile: updateProfile(await cookies(), parsed.data) },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof ApiError
            ? error.message
            : 'Không thể cập nhật hồ sơ.',
      },
      { status: error instanceof ApiError ? (error.status ?? 400) : 500 },
    );
  }
}
