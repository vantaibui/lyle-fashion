import { cookies } from 'next/headers';
import { metadataForRoute } from '@/app/route-foundation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getAccountSnapshot } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { AddressBook } from '@/modules/customer/components/address-book';
export const metadata = metadataForRoute('addresses');
export const dynamic = 'force-dynamic';
export default async function Page() {
  await requireAuth('/account/addresses');
  const { addresses } = getAccountSnapshot(await cookies());
  return (
    <AccountShell title="Địa chỉ">
      <AddressBook addresses={addresses} />
    </AccountShell>
  );
}
