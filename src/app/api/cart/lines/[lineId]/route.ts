import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { ApiError } from '@/lib/api/error';
import {
  removeCartLine,
  updateCartLineQuantity,
} from '@/modules/cart/server/cart-store';

const quantityUpdateSchema = z.object({
  quantity: z.int().min(1).max(5),
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ lineId: string }> },
) {
  const requestId = crypto.randomUUID();

  try {
    const payload = await request.json();
    const parsed = quantityUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(
        new ApiError('Số lượng cập nhật không hợp lệ.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        }),
        requestId,
      );
    }

    const { lineId } = await context.params;
    const result = updateCartLineQuantity(
      await cookies(),
      lineId,
      parsed.data.quantity,
    );
    const response = NextResponse.json(
      {
        cart: result.cart,
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
        : new ApiError('Không thể cập nhật giỏ hàng.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ lineId: string }> },
) {
  const requestId = crypto.randomUUID();

  try {
    const { lineId } = await context.params;
    const result = removeCartLine(await cookies(), lineId);
    const response = NextResponse.json(
      {
        cart: result.cart,
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
        : new ApiError('Không thể xóa dòng giỏ hàng.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
