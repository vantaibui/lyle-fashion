import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 max-w-full items-center rounded-xs border px-2 py-0.5 text-xs leading-snug font-medium tracking-wide break-words',
        tone === 'neutral' && 'border-border bg-surface-muted text-text',
        tone === 'success' && 'border-success bg-success-surface text-success',
        tone === 'warning' && 'border-warning bg-warning-surface text-warning',
        tone === 'danger' && 'border-danger bg-danger-surface text-danger',
        tone === 'info' && 'border-info bg-info-surface text-info',
        className,
      )}
      {...props}
    />
  );
}
