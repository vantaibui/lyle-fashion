import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  clearAdminSessionCookie,
  endAdminSession,
} from '@/modules/admin-auth/server/admin-auth-store';

export async function POST() {
  endAdminSession(await cookies());
  const response = new NextResponse(null, { status: 204 });
  response.headers.append('set-cookie', clearAdminSessionCookie());
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
