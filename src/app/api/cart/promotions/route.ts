import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { ApiError } from '@/lib/api/error';
import {
  applyPromotionCode,
  getFreeShippingProgress,
} from '@/modules/cart/server/cart-store';

const promotionSchema = z.object({
  code: z.string().trim().min(1).max(40),
});

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

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const payload = await request.json();
    const parsed = promotionSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(
        new ApiError('Mã khuyến mãi không hợp lệ.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        }),
        requestId,
      );
    }

    const result = applyPromotionCode(await cookies(), parsed.data.code);
    const response = NextResponse.json(
      {
        cart: result.cart,
        freeShippingProgress: getFreeShippingProgress(result.cart),
        promotionResult: result.promotionResult,
        requestId,
      },
      {
        headers: { 'x-request-id': requestId },
        status:
          result.promotionResult.code === 'APPLIED'
            ? 200
            : result.promotionResult.code === 'INVALID_CODE'
              ? 404
              : 409,
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
        : new ApiError('Không thể áp dụng khuyến mãi.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
