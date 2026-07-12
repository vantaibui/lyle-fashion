import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { ApiError } from '@/lib/api/error';
import {
  applyShippingEstimate,
  getFreeShippingProgress,
} from '@/modules/cart/server/cart-store';

const shippingEstimateSchema = z.object({
  districtCode: z.string().trim().min(1).max(40),
  districtName: z.string().trim().min(1).max(120),
  method: z.enum(['express', 'pickup', 'standard']),
  provinceCode: z.string().trim().min(1).max(40),
  provinceName: z.string().trim().min(1).max(120),
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
    const parsed = shippingEstimateSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse(
        new ApiError('Địa chỉ giao hàng chưa đủ để tính phí.', {
          code: 'VALIDATION_ERROR',
          status: 400,
        }),
        requestId,
      );
    }
    const result = applyShippingEstimate(await cookies(), parsed.data);
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
        : new ApiError('Không thể tính phí giao hàng.', {
            code: 'UNEXPECTED_SERVER_ERROR',
            status: 500,
          }),
      requestId,
    );
  }
}
