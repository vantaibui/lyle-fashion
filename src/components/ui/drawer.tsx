'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

import { IconButton } from './icon-button';

export type DrawerProps = {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title: ReactNode;
};

export function Drawer({
  children,
  className,
  isOpen,
  onClose,
  side = 'right',
  title,
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const drawer = ref.current;
    if (!drawer) return;
    if (isOpen && !drawer.open) drawer.showModal();
    if (!isOpen && drawer.open) drawer.close();
  }, [isOpen]);

  return (
    <dialog
      className={cn(
        'bg-surface text-text shadow-overlay backdrop:bg-scrim fixed inset-y-0 m-0 h-dvh max-h-none w-[min(26rem,calc(100%-2rem))] max-w-none overscroll-contain border-0 p-0 open:animate-[lyle-drawer-in_var(--duration-slow)_var(--ease-enter)] motion-reduce:open:animate-none',
        side === 'right' ? 'right-0 left-auto' : 'right-auto left-0',
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      ref={ref}
    >
      <div className="flex min-h-full flex-col pb-[env(safe-area-inset-bottom)]">
        <div className="border-border-subtle flex min-h-16 items-center justify-between gap-4 border-b px-4 pt-[env(safe-area-inset-top)] sm:px-6">
          <h2 className="font-display text-xl">{title}</h2>
          <IconButton label="Đóng ngăn kéo" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {children}
        </div>
      </div>
    </dialog>
  );
}
