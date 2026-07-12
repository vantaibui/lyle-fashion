import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { createReturn } from '@/modules/account/server/account-store';
import { returnRequestSchema } from '@/modules/return/schemas/return';

export async function POST(request: Request) {
  const parsed = returnRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        message: 'Yêu cầu đổi trả chưa hợp lệ.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { returnRequest: createReturn(await cookies(), parsed.data) },
      { headers: { 'Cache-Control': 'private, no-store' }, status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof ApiError ? error.message : 'Không thể gửi yêu cầu.',
      },
      { status: error instanceof ApiError ? (error.status ?? 400) : 500 },
    );
  }
}
