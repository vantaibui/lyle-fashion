import type { DetailsHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type PopoverProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  children: ReactNode;
  label: ReactNode;
};

export function Popover({
  children,
  className,
  label,
  ...props
}: PopoverProps) {
  return (
    <details
      className={cn('group relative inline-block', className)}
      {...props}
    >
      <summary className="border-border bg-surface hover:border-border-strong inline-flex min-h-11 cursor-pointer list-none items-center rounded-xs border px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div className="border-border bg-surface shadow-overlay absolute top-[calc(100%+0.5rem)] left-0 z-[var(--z-dropdown)] min-w-56 rounded-sm border p-4">
        {children}
      </div>
    </details>
  );
}
