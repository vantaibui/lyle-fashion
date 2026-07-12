import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description: ReactNode;
  title?: ReactNode;
};

export function ErrorState({
  action,
  className,
  description,
  title = 'Không thể tải nội dung',
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'border-danger bg-danger-surface grid gap-3 rounded-xs border p-5',
        className,
      )}
      role="alert"
      {...props}
    >
      <h2 className="font-display text-xl leading-tight text-pretty">
        {title}
      </h2>
      <p className="text-text-muted text-pretty">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
