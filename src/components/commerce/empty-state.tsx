import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description: ReactNode;
  title: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-lg justify-items-center gap-3 py-12 text-center',
        className,
      )}
      {...props}
    >
      <h2 className="font-display text-2xl leading-tight text-pretty">
        {title}
      </h2>
      <p className="text-text-muted text-pretty">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
