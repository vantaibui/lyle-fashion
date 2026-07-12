import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ApiError } from '@/lib/api/error';
import type { CartLineIntentInput } from '@/modules/cart/contracts/cart-intent';
import { cartLineIntentInputSchema } from '@/modules/cart/schemas/cart-intent';
import { addLineToCart } from '@/modules/cart/server/cart-store';

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

function applyCartCookie(response: NextResponse, cookie?: string) {
  if (cookie) response.headers.append('set-cookie', cookie);
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  let payload: CartLineIntentInput | unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse(
      new ApiError('Yêu cầu không đúng định dạng JSON.', {
        code: 'VALIDATION_ERROR',
        status: 400,
      }),
      requestId,
    );
  }

  const parsed = cartLineIntentInputSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      new ApiError('Dữ liệu thêm vào giỏ không hợp lệ.', {
        code: 'VALIDATION_ERROR',
        status: 400,
      }),
      requestId,
    );
  }

  try {
    const result = addLineToCart(await cookies(), parsed.data);
    const response = NextResponse.json(
      {
        cart: result.cart,
        lineCount: result.cart.lines.length,
        requestId,
      },
      {
        headers: { 'x-request-id': requestId },
        status: 201,
      },
    );
    applyCartCookie(response, result.setCartCookie);
    return response;
  } catch (error) {
    return errorResponse(
      error instanceof ApiError
        ? error
        : new ApiError('Không thể thêm sản phẩm vào giỏ.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
