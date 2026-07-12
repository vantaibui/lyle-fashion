import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { AccountShell } from '@/modules/account/components/account-shell';
import { getOrder } from '@/modules/account/server/account-store';
import { requireAuth } from '@/modules/auth/server/require-auth';
import { OrderDetail } from '@/modules/order/components/order-detail';
import { ApiError } from '@/lib/api/error';
import { accountOrderParamsSchema } from '@/lib/validation/route-params';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ orderId: string }> };

export default async function Page({ params }: PageProps) {
  const raw = await params;
  await requireAuth(`/account/orders/${encodeURIComponent(raw.orderId)}`);
  const result = accountOrderParamsSchema.safeParse(raw);
  if (!result.success) notFound();
  let order;
  try {
    order = getOrder(await cookies(), result.data.orderId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  return (
    <AccountShell title={`Đơn ${result.data.orderId}`}>
      <OrderDetail order={order} />
    </AccountShell>
  );
}
