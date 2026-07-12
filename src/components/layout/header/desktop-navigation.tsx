'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Link } from '@/components/ui/link';
import type { NavigationGroup } from '@/config/navigation';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import { cn } from '@/lib/utils/cn';

type DesktopNavigationProps = {
  groups: NavigationGroup[];
};

export function DesktopNavigation({ groups }: DesktopNavigationProps) {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  function clearCloseTimer() {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }

  function closeMenu(restoreFocus = false) {
    const currentId = openId;
    setOpenId(null);
    if (restoreFocus && currentId) triggerRefs.current.get(currentId)?.focus();
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => closeMenu(), 180);
  }

  function openMenu(id: string) {
    clearCloseTimer();
    setOpenId(id);
    noStorefrontAnalytics({
      name: 'mega_menu_open',
      properties: { group: id },
    });
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) closeMenu();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      clearCloseTimer();
    };
  });

  return (
    <nav aria-label="Điều hướng chính" className="relative" ref={navRef}>
      <ul className="flex items-center gap-1" role="list">
        {groups.map((group, index) => {
          const isOpen = openId === group.id;
          const isActive = group.items.some(
            (item) => new URL(item.href, 'http://local').pathname === pathname,
          );
          const panelId = `navigation-panel-${group.id}`;

          return (
            <li key={group.id} onPointerLeave={scheduleClose}>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className={cn(
                  'hover:bg-surface-muted relative min-h-11 cursor-pointer border-0 bg-transparent px-4 text-sm font-medium tracking-wide transition-colors duration-[var(--duration-fast)]',
                  isActive &&
                    'after:bg-brand-flax after:absolute after:inset-x-4 after:bottom-1 after:h-px',
                )}
                onClick={() => (isOpen ? closeMenu() : openMenu(group.id))}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    closeMenu(true);
                  }
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openMenu(group.id);
                    requestAnimationFrame(() => {
                      navRef.current
                        ?.querySelector<HTMLAnchorElement>(`#${panelId} a`)
                        ?.focus();
                    });
                  }
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const direction = event.key === 'ArrowRight' ? 1 : -1;
                    const nextIndex =
                      (index + direction + groups.length) % groups.length;
                    const nextGroup = groups[nextIndex];
                    if (nextGroup)
                      triggerRefs.current.get(nextGroup.id)?.focus();
                  }
                }}
                ref={(node) => {
                  if (node) triggerRefs.current.set(group.id, node);
                  else triggerRefs.current.delete(group.id);
                }}
                type="button"
              >
                {group.label}
              </button>

              <div
                className={cn(
                  'border-border bg-surface shadow-overlay absolute top-full left-1/2 z-[var(--z-dropdown)] mt-px w-[min(70rem,calc(100vw-4rem))] -translate-x-1/2 border px-10 py-8',
                  !isOpen && 'hidden',
                )}
                id={panelId}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    closeMenu(true);
                  }
                }}
                onPointerEnter={clearCloseTimer}
                onPointerLeave={scheduleClose}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(14rem,0.35fr)] gap-12">
                  <div>
                    <p className="text-text-subtle tracking-caps mb-4 text-xs font-medium uppercase">
                      {group.label}
                    </p>
                    <ul className="grid grid-cols-2 gap-x-10" role="list">
                      {group.items.map((item) => (
                        <li
                          className="border-border-subtle border-b"
                          key={item.href}
                        >
                          <Link
                            className="w-full justify-between py-2 no-underline"
                            href={item.href}
                            onClick={() => {
                              noStorefrontAnalytics({
                                name: 'navigation_click',
                                properties: {
                                  group: group.id,
                                  target: item.href,
                                },
                              });
                              closeMenu();
                            }}
                          >
                            {item.label}
                            <span aria-hidden="true">↗</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-brand-flax border-l pl-8">
                    <p className="font-display text-2xl leading-tight">
                      Chất liệu tự nhiên,
                      <br /> nhịp sống hiện đại.
                    </p>
                    <p className="text-text-muted mt-4 text-sm">
                      Khám phá theo danh mục, bộ sưu tập hoặc câu chuyện chất
                      liệu.
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
