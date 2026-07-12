import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  getCartForCookies,
  getFreeShippingProgress,
} from '@/modules/cart/server/cart-store';

export async function GET() {
  const requestId = crypto.randomUUID();
  const result = getCartForCookies(await cookies());
  const response = NextResponse.json(
    {
      cart: result.cart,
      freeShippingProgress: getFreeShippingProgress(result.cart),
      mergeSummary: result.mergeSummary,
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
}
