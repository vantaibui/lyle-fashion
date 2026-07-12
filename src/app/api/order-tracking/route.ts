import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/error';
import { trackGuestOrder } from '@/modules/account/server/account-store';

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const key =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const current = attempts.get(key);
  if (current && current.resetAt > Date.now() && current.count >= 5) {
    return NextResponse.json(
      { message: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.' },
      { status: 429 },
    );
  }
  attempts.set(key, {
    count: current && current.resetAt > Date.now() ? current.count + 1 : 1,
    resetAt: Date.now() + 60_000,
  });
  const body = (await request.json().catch(() => null)) as {
    code?: unknown;
    contact?: unknown;
  } | null;
  if (typeof body?.code !== 'string' || typeof body.contact !== 'string')
    return NextResponse.json(
      { message: 'Không thể xác minh thông tin tra cứu.' },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { tracking: trackGuestOrder(body.code, body.contact) },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể xác minh thông tin tra cứu.' },
      { status: error instanceof ApiError ? (error.status ?? 404) : 500 },
    );
  }
}
