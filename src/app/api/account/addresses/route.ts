import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { addAddress } from '@/modules/account/server/account-store';
import { customerAddressSchema } from '@/modules/customer/schemas/customer';

export async function POST(request: Request) {
  const parsed = customerAddressSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        message: 'Địa chỉ chưa hợp lệ.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { address: addAddress(await cookies(), parsed.data) },
      { headers: { 'Cache-Control': 'private, no-store' }, status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof ApiError ? error.message : 'Không thể thêm địa chỉ.',
      },
      { status: error instanceof ApiError ? (error.status ?? 400) : 500 },
    );
  }
}
