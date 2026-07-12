import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  title: ReactNode;
  tone?: 'neutral' | 'success' | 'error';
};

export function Toast({
  action,
  children,
  className,
  title,
  tone = 'neutral',
  ...props
}: ToastProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        'bg-surface text-text shadow-overlay flex w-[min(24rem,calc(100vw-2rem))] items-start gap-4 rounded-sm border p-4',
        tone === 'neutral' && 'border-border',
        tone === 'success' && 'border-success',
        tone === 'error' && 'border-danger',
        className,
      )}
      role="status"
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium break-words">{title}</p>
        {children && (
          <div className="text-text-muted mt-1 text-sm break-words">
            {children}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
