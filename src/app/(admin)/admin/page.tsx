import { ErrorState } from '@/components/commerce/error-state';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { DashboardOverview } from '@/modules/admin-dashboard/components/dashboard-overview';
import { getDashboardSnapshot } from '@/modules/admin-dashboard/services/dashboard-page';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Tổng quan vận hành LYLE Fashion.',
  pathname: '/admin',
  title: 'Tổng quan',
});

export default async function Page() {
  const session = await requireAdminAuth('/admin');
  const { data: snapshot, error } = await getDashboardSnapshot();

  return (
    <AdminShell activePath="/admin" session={session} title="Tổng quan">
      {error ? (
        <ErrorState description="Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau." />
      ) : (
        <DashboardOverview snapshot={snapshot} />
      )}
    </AdminShell>
  );
}
