'use client';

import Link from 'next/link';

import { BagIcon } from '@/components/layout/header/icons';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils/cn';

type CartTriggerButtonProps = {
  count?: number;
  /** When set, renders as a link to this route instead of a drawer trigger. */
  href?: string;
  label: string;
  onClick?: () => void;
};

const triggerClassName =
  'border-border hover:border-border-strong hover:bg-surface-muted relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-[background-color,border-color] duration-[var(--duration-fast)]';

export function CartTriggerButton({
  count,
  href,
  label,
  onClick,
}: CartTriggerButtonProps) {
  const accessibleLabel =
    typeof count === 'number' ? `${label}, ${count} mục` : label;

  const inner = (
    <>
      <BagIcon />
      {typeof count === 'number' && count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            'bg-action text-text-inverse text-2xs absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full px-1 tabular-nums',
            count > 99 && 'min-w-7',
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
      <VisuallyHidden>{accessibleLabel}</VisuallyHidden>
    </>
  );

  if (href) {
    return (
      <Link
        aria-label={accessibleLabel}
        className={triggerClassName}
        href={href}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      aria-label={accessibleLabel}
      className={triggerClassName}
      onClick={onClick}
      type="button"
    >
      {inner}
    </button>
  );
}
