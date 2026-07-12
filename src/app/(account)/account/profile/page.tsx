import { cookies } from 'next/headers';
import { metadataForRoute } from '@/app/route-foundation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getAccountSnapshot } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { ProfileForm } from '@/modules/customer/components/profile-form';
export const metadata = metadataForRoute('profile');
export const dynamic = 'force-dynamic';
export default async function Page() {
  await requireAuth('/account/profile');
  const { profile } = getAccountSnapshot(await cookies());
  return (
    <AccountShell title="Hồ sơ">
      <ProfileForm profile={profile} />
    </AccountShell>
  );
}
