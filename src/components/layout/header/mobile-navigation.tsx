'use client';

import { useRef, useState } from 'react';

import {
  AccountIcon,
  ArrowLeftIcon,
  ChevronIcon,
  MenuIcon,
} from '@/components/layout/header/icons';
import { Drawer } from '@/components/ui/drawer';
import { IconButton } from '@/components/ui/icon-button';
import { Link } from '@/components/ui/link';
import type { NavigationGroup } from '@/config/navigation';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';

export function MobileNavigation({ groups }: { groups: NavigationGroup[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeGroup = groups.find((group) => group.id === activeGroupId);

  function close() {
    setIsOpen(false);
    setActiveGroupId(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <IconButton
        className="xl:hidden"
        label="Mở menu"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        isOpen={isOpen}
        onClose={close}
        side="left"
        title={activeGroup?.label ?? 'Menu'}
      >
        {activeGroup ? (
          <div>
            <button
              className="border-border-subtle hover:bg-surface-muted mb-3 flex min-h-11 w-full cursor-pointer items-center gap-3 border-0 border-b bg-transparent px-1 text-left text-sm font-medium"
              onClick={() => setActiveGroupId(null)}
              type="button"
            >
              <ArrowLeftIcon />
              Menu chính
            </button>
            <nav aria-label={`Danh mục ${activeGroup.label}`}>
              <ul role="list">
                {activeGroup.items.map((item) => (
                  <li className="border-border-subtle border-b" key={item.href}>
                    <Link
                      className="w-full py-2 no-underline"
                      href={item.href}
                      onClick={() => {
                        noStorefrontAnalytics({
                          name: 'navigation_click',
                          properties: {
                            group: activeGroup.id,
                            target: item.href,
                          },
                        });
                        close();
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : (
          <nav aria-label="Điều hướng di động">
            <ul className="grid gap-1" role="list">
              {groups.map((group) => (
                <li key={group.id}>
                  <button
                    className="hover:bg-surface-muted flex min-h-12 w-full cursor-pointer items-center justify-between border-0 bg-transparent px-1 text-left font-medium"
                    onClick={() => setActiveGroupId(group.id)}
                    type="button"
                  >
                    {group.label}
                    <ChevronIcon />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-brand-flax mt-8 grid gap-1 border-t pt-5">
              <Link
                className="gap-3 no-underline"
                href="/account"
                onClick={close}
              >
                <AccountIcon />
                Tài khoản
              </Link>
              <Link className="no-underline" href="/stores" onClick={close}>
                Cửa hàng
              </Link>
            </div>
          </nav>
        )}
      </Drawer>
    </>
  );
}
