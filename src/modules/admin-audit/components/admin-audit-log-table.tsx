import type { AuditLogEntry } from '@/modules/admin-auth/contracts/audit-log';
import { auditActionLabel } from '@/modules/admin-auth/utils/audit-action-label';
import { adminRoleLabel } from '@/modules/admin-auth/utils/role-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function AdminAuditLogTable({ items }: { items: AuditLogEntry[] }) {
  return (
    <div className="border-border-subtle overflow-x-auto rounded-xs border">
      <table className="w-full min-w-5xl border-collapse text-sm">
        <caption className="sr-only">Nhật ký hoạt động quản trị</caption>
        <thead>
          <tr className="border-border-subtle bg-surface-muted border-b text-left">
            <th className="px-4 py-3 font-semibold" scope="col">
              Thời gian
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Hành động
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Vai trò thực hiện
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Đối tượng
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Nội dung
            </th>
          </tr>
        </thead>
        <tbody className="divide-border-subtle divide-y">
          {items.map((entry) => (
            <tr key={entry.eventId}>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatAdminTimestamp(entry.timestamp)}
              </td>
              <td className="px-4 py-3">{auditActionLabel(entry.action)}</td>
              <td className="px-4 py-3">{adminRoleLabel(entry.actorRole)}</td>
              <td className="px-4 py-3">
                {entry.resourceType} · {entry.resourceId}
              </td>
              <td className="px-4 py-3">{entry.safeSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
