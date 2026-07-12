import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  clearSessionCookie,
  endSession,
} from '@/modules/account/server/account-store';

export async function POST() {
  endSession(await cookies());
  const response = new NextResponse(null, { status: 204 });
  response.headers.append('set-cookie', clearSessionCookie());
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
