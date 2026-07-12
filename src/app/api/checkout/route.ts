import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

import { ApiError } from '@/lib/api/error';
import { checkoutInputSchema } from '@/modules/checkout/schemas/checkout';
import { submitCheckout } from '@/modules/cart/server/cart-store';

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
    const idempotencyKey =
      (await headers()).get('x-idempotency-key')?.trim() ?? '';
    if (!idempotencyKey) {
      return errorResponse(
        new ApiError('Thiếu idempotency key cho lượt đặt hàng.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        }),
        requestId,
      );
    }

    const payload = await request.json();
    const parsed = checkoutInputSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(
        new ApiError('Thông tin thanh toán chưa hợp lệ.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        }),
        requestId,
      );
    }

    const result = submitCheckout(await cookies(), idempotencyKey, parsed.data);
    const response = NextResponse.json(
      {
        checkout: result.checkout,
        requestId,
      },
      {
        headers: { 'x-request-id': requestId },
        status: 201,
      },
    );
    if (result.setCartCookie) {
      response.headers.append('set-cookie', result.setCartCookie);
    }
    if (result.setOrderAccessCookie) {
      response.headers.append('set-cookie', result.setOrderAccessCookie);
    }
    return response;
  } catch (error) {
    return errorResponse(
      error instanceof ApiError
        ? error
        : new ApiError('Không thể tạo đơn hàng.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
