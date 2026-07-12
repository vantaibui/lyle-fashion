import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { deleteAddress } from '@/modules/account/server/account-store';

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ addressId: string }> },
) {
  try {
    const { addressId } = await params;
    deleteAddress(await cookies(), addressId);
    return new NextResponse(null, {
      headers: { 'Cache-Control': 'private, no-store' },
      status: 204,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof ApiError ? error.message : 'Không thể xóa địa chỉ.',
      },
      { status: error instanceof ApiError ? (error.status ?? 400) : 500 },
    );
  }
}
