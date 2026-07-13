import Link from 'next/link';

import { adminNavigation } from '@/modules/admin-auth/contracts/navigation';
import {
  hasAdminPermission,
  type AdminSession,
} from '@/modules/admin-auth/contracts/session';
import { cn } from '@/lib/utils/cn';

export function AdminNav({
  activePath,
  session,
}: {
  activePath: string;
  session: AdminSession;
}) {
  const groups = adminNavigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        hasAdminPermission(session, item.permission),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav aria-label="Điều hướng quản trị" className="grid gap-6">
      {groups.map((group) => (
        <div key={group.id}>
          <h2 className="text-text-subtle px-3 text-xs font-semibold tracking-wide uppercase">
            {group.label}
          </h2>
          <ul className="mt-2 grid gap-1">
            {group.items.map((item) => {
              const isActive =
                activePath === item.href ||
                activePath.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block min-h-11 rounded-xs px-3 py-2.5 text-sm break-words',
                      isActive
                        ? 'bg-action text-text-inverse font-medium'
                        : 'text-text hover:bg-surface-muted',
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
