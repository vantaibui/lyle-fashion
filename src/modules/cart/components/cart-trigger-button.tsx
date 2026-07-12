'use client';

import { BagIcon } from '@/components/layout/header/icons';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils/cn';

type CartTriggerButtonProps = {
  count?: number;
  label: string;
  onClick: () => void;
};

export function CartTriggerButton({
  count,
  label,
  onClick,
}: CartTriggerButtonProps) {
  const accessibleLabel =
    typeof count === 'number' ? `${label}, ${count} mục` : label;

  return (
    <button
      aria-label={accessibleLabel}
      className="border-border hover:border-border-strong hover:bg-surface-muted relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-[background-color,border-color] duration-[var(--duration-fast)]"
      onClick={onClick}
      type="button"
    >
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
    </button>
  );
}
