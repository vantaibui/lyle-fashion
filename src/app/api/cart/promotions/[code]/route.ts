import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ApiError } from '@/lib/api/error';
import {
  getFreeShippingProgress,
  removePromotionCode,
} from '@/modules/cart/server/cart-store';

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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const requestId = crypto.randomUUID();

  try {
    const { code } = await context.params;
    const result = removePromotionCode(await cookies(), code);
    const response = NextResponse.json(
      {
        cart: result.cart,
        freeShippingProgress: getFreeShippingProgress(result.cart),
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
        : new ApiError('Không thể gỡ khuyến mãi.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
