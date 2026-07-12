import { cookies } from 'next/headers';
import { metadataForRoute } from '@/app/route-foundation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getOrders } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { OrderList } from '@/modules/order/components/order-list';
export const metadata = metadataForRoute('orders');
export const dynamic = 'force-dynamic';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAuth('/account/orders');
  const requested = Number((await searchParams).page ?? '1');
  const page = Number.isInteger(requested) && requested > 0 ? requested : 1;
  const result = getOrders(await cookies(), page);
  return (
    <AccountShell title="Đơn hàng">
      <OrderList orders={result.items} />
    </AccountShell>
  );
}
