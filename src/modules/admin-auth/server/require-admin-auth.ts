import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAdminSession } from '@/modules/admin-auth/server/admin-auth-store';
import { safeAdminReturnUrl } from '@/modules/admin-auth/utils/safe-admin-return-url';

export async function requireAdminAuth(returnTo: string) {
  const session = getAdminSession(await cookies());
  if (!session)
    redirect(
      `/admin/login?returnTo=${encodeURIComponent(safeAdminReturnUrl(returnTo))}`,
    );
  return session;
}
