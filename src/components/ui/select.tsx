import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  isInvalid?: boolean;
  isLoading?: boolean;
};

export function Select({
  children,
  className,
  disabled,
  isInvalid = false,
  isLoading = false,
  ...props
}: SelectProps) {
  return (
    <select
      aria-busy={isLoading || undefined}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'border-border bg-surface text-text hover:border-border-strong disabled:bg-surface-muted min-h-[var(--control-height-md)] w-full cursor-pointer rounded-xs border px-3 py-2 text-base transition-[border-color,background-color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-70',
        isInvalid && 'border-danger',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </select>
  );
}
