import { EmptyState } from '@/components/commerce/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { createRouteMetadata } from '@/lib/seo/metadata';
import { AdminAuditLogTable } from '@/modules/admin-audit/components/admin-audit-log-table';
import { getAdminAuditLogPage } from '@/modules/admin-audit/services/admin-audit-log-page';
import { requireAdminAuth } from '@/modules/admin-auth/server/require-admin-auth';
import { requirePagePermission } from '@/modules/admin-auth/server/require-admin-permission';
import { AdminShell } from '@/modules/admin-shell/components/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Nhật ký hoạt động quản trị LYLE Fashion.',
  pathname: '/admin/audit-log',
  title: 'Nhật ký hoạt động',
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireAdminAuth('/admin/audit-log');
  requirePagePermission(session, 'audit-log.read');

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const auditLog = await getAdminAuditLogPage(page);
  const totalPages = Math.max(1, Math.ceil(auditLog.total / auditLog.pageSize));

  return (
    <AdminShell
      activePath="/admin/audit-log"
      breadcrumbs={[
        { href: '/admin', label: 'Tổng quan' },
        { current: true, label: 'Nhật ký hoạt động' },
      ]}
      session={session}
      title="Nhật ký hoạt động"
    >
      {auditLog.items.length === 0 ? (
        <EmptyState
          description="Chưa có hoạt động nào được ghi nhận."
          title="Chưa có nhật ký"
        />
      ) : (
        <div className="grid gap-6">
          <AdminAuditLogTable items={auditLog.items} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              getHref={(nextPage) =>
                nextPage === 1
                  ? '/admin/audit-log'
                  : `/admin/audit-log?page=${nextPage}`
              }
              totalPages={totalPages}
            />
          )}
        </div>
      )}
    </AdminShell>
  );
}
