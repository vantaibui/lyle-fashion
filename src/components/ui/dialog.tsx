'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

import { IconButton } from './icon-button';

export type DialogProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  title: ReactNode;
};

export function Dialog({
  children,
  className,
  description,
  isLoading = false,
  isOpen,
  onClose,
  title,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      aria-busy={isLoading || undefined}
      className={cn(
        'border-border bg-surface text-text shadow-overlay backdrop:bg-scrim m-auto max-h-[min(42rem,calc(100dvh-2rem))] w-[min(36rem,calc(100%-2rem))] overflow-auto overscroll-contain rounded-sm border p-0 open:animate-[lyle-dialog-in_var(--duration-normal)_var(--ease-enter)] motion-reduce:open:animate-none',
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="border-border-subtle flex items-start justify-between gap-4 border-b p-5 sm:p-6">
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight text-pretty">
            {title}
          </h2>
          {description && (
            <p className="text-text-muted mt-2 text-sm text-pretty">
              {description}
            </p>
          )}
        </div>
        <IconButton label="Đóng hộp thoại" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </IconButton>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  );
}
