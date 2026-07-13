import { AdminLogoutButton } from '@/modules/admin-auth/components/admin-logout-button';
import type { AdminSession } from '@/modules/admin-auth/contracts/session';
import { adminRoleLabel } from '@/modules/admin-auth/utils/role-label';

const environmentLabel =
  process.env.NODE_ENV === 'production'
    ? null
    : process.env.NODE_ENV.toUpperCase();

export function AdminTopbar({ session }: { session: AdminSession }) {
  return (
    <header className="border-border-subtle bg-surface sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg">LYLE Admin</span>
          {environmentLabel && (
            <span className="border-warning bg-warning-surface text-warning rounded-xs border px-2 py-0.5 text-xs font-medium tracking-wide uppercase">
              {environmentLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-text-muted hidden text-sm sm:inline">
            {adminRoleLabel(session.role)}
          </span>
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}
