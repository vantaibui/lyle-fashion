import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ApiError } from '@/lib/api/error';
import { moveCartLineToWishlist } from '@/modules/cart/server/cart-store';

function errorResponse(error: ApiError, requestId: string) {
  return NextResponse.json(
    {
      code: error.code,
      message: error.message,
      requestId,
    },
    {
      headers: { 'x-request-id': requestId },
      status: error.status ?? 400,
    },
  );
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ lineId: string }> },
) {
  const requestId = crypto.randomUUID();

  try {
    const { lineId } = await context.params;
    const result = moveCartLineToWishlist(await cookies(), lineId);
    const response = NextResponse.json(
      {
        cart: result.cart,
        moved: true,
        requestId,
      },
      {
        headers: { 'x-request-id': requestId },
        status: 200,
      },
    );
    if (result.setCartCookie) {
      response.headers.append('set-cookie', result.setCartCookie);
    }
    return response;
  } catch (error) {
    return errorResponse(
      error instanceof ApiError
        ? error
        : new ApiError('Không thể chuyển sản phẩm sang yêu thích.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
