import type { ReactNode } from 'react';

import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { AdminMobileNav } from '@/modules/admin-shell/components/admin-mobile-nav';
import { AdminNav } from '@/modules/admin-shell/components/admin-nav';
import { AdminTopbar } from '@/modules/admin-shell/components/admin-topbar';
import type { AdminSession } from '@/modules/admin-auth/contracts/session';

export function AdminShell({
  activePath,
  breadcrumbs,
  children,
  session,
  title,
}: {
  activePath: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  session: AdminSession;
  title: string;
}) {
  return (
    <div className="bg-surface-muted min-h-dvh">
      <a
        className="focus:bg-surface focus:text-text sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--z-modal)] focus:rounded-xs focus:px-4 focus:py-2"
        href="#admin-main-content"
      >
        Bỏ qua điều hướng
      </a>
      <AdminTopbar session={session} />
      <AdminMobileNav activePath={activePath} session={session} />
      <div className="mx-auto grid w-full max-w-[100rem] gap-0 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="border-border-subtle hidden border-r px-4 py-6 lg:block">
          <AdminNav activePath={activePath} session={session} />
        </aside>
        <main
          className="min-w-0 px-4 py-6 lg:px-8"
          id="admin-main-content"
          tabIndex={-1}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="mb-4" items={breadcrumbs} />
          )}
          <h1 className="font-display mb-6 text-2xl text-pretty md:text-3xl">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}
