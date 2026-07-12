import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isInvalid?: boolean;
  isLoading?: boolean;
};

export function Textarea({
  className,
  disabled,
  isInvalid = false,
  isLoading = false,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-busy={isLoading || undefined}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'border-border bg-surface text-text placeholder:text-text-subtle hover:border-border-strong disabled:bg-surface-muted w-full resize-y rounded-xs border px-3 py-2 text-base transition-[border-color,background-color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-70',
        isInvalid && 'border-danger',
        className,
      )}
      disabled={disabled || isLoading}
      rows={rows}
      {...props}
    />
  );
}
