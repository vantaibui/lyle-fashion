import { notFound } from 'next/navigation';

import { ErrorState } from '@/components/commerce/error-state';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminOrderSummaryCard } from '@/modules/admin-order/components/admin-order-summary-card';
import { adminOrderParamsSchema } from '@/modules/admin-order/schemas/admin-order-params';
import { getAdminOrderDetail } from '@/modules/admin-order/services/admin-order-detail-page';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { requirePagePermission } from '@/modules/admin-auth/server/require-admin-permission';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Chi tiết đơn hàng LYLE Fashion.',
  pathname: '/admin/orders',
  title: 'Chi tiết đơn hàng',
});

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await requireAdminAuth('/admin/orders');
  requirePagePermission(session, 'order.read');

  const parsedParams = adminOrderParamsSchema.safeParse(await params);
  if (!parsedParams.success) notFound();

  const { data: order, error } = await getAdminOrderDetail(
    parsedParams.data.orderId,
  );
  if (!error && !order) notFound();

  return (
    <AdminShell
      activePath="/admin/orders"
      breadcrumbs={[
        { href: '/admin', label: 'Tổng quan' },
        { href: '/admin/orders', label: 'Đơn hàng' },
        { current: true, label: order?.code ?? 'Đơn hàng' },
      ]}
      session={session}
      title={order?.code ?? 'Đơn hàng'}
    >
      {error || !order ? (
        <ErrorState description="Không thể tải thông tin đơn hàng. Vui lòng thử lại sau." />
      ) : (
        <AdminOrderSummaryCard order={order} />
      )}
    </AdminShell>
  );
}
