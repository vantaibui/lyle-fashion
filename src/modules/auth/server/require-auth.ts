import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getSession } from '@/modules/account/server/account-store';
import { safeReturnUrl } from '@/modules/auth/utils/safe-return-url';

export async function requireAuth(returnTo: string) {
  const session = getSession(await cookies());
  if (!session)
    redirect(`/login?returnTo=${encodeURIComponent(safeReturnUrl(returnTo))}`);
  return session;
}
