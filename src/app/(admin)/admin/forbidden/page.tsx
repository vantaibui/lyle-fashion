import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminForbidden } from '@/modules/admin-shell/components/admin-forbidden';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Không đủ quyền truy cập chức năng quản trị này.',
  pathname: '/admin/forbidden',
  title: 'Không đủ quyền truy cập',
});

export default async function Page() {
  const session = await requireAdminAuth('/admin/forbidden');
  return (
    <AdminShell
      activePath="/admin/forbidden"
      session={session}
      title="Không đủ quyền truy cập"
    >
      <AdminForbidden />
    </AdminShell>
  );
}
