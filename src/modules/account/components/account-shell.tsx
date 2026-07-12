import Link from 'next/link';
import type { ReactNode } from 'react';

import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { LogoutButton } from '@/modules/auth/components/logout-button';

const links = [
  ['/account', 'Tổng quan'],
  ['/account/profile', 'Hồ sơ'],
  ['/account/addresses', 'Địa chỉ'],
  ['/account/orders', 'Đơn hàng'],
  ['/account/returns', 'Đổi trả'],
] as const;

export function AccountShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside>
            <nav
              aria-label="Tài khoản"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col"
            >
              {links.map(([href, label]) => (
                <Link
                  className="border-border hover:bg-surface-muted min-h-11 shrink-0 border px-4 py-2.5 text-sm"
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
              <LogoutButton />
            </nav>
          </aside>
          <main className="min-w-0">
            <h1 className="font-display mb-8 text-3xl text-pretty md:text-4xl">
              {title}
            </h1>
            {children}
          </main>
        </div>
      </Container>
    </Section>
  );
}
