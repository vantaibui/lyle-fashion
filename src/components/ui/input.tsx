import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
  isLoading?: boolean;
};

export function Input({
  'aria-describedby': ariaDescribedBy,
  className,
  disabled,
  isInvalid = false,
  isLoading = false,
  ...props
}: InputProps) {
  return (
    <input
      aria-busy={isLoading || undefined}
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'border-border bg-surface text-text placeholder:text-text-subtle hover:border-border-strong disabled:bg-surface-muted min-h-[var(--control-height-md)] w-full rounded-xs border px-3 py-2 text-base transition-[border-color,background-color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-70',
        isInvalid && 'border-danger',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    />
  );
}
