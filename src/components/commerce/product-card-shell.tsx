import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ProductCardShellProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  badges?: ReactNode;
  details: ReactNode;
  media: ReactNode;
};

export function ProductCardShell({
  actions,
  badges,
  className,
  details,
  media,
  ...props
}: ProductCardShellProps) {
  return (
    <article className={cn('group min-w-0', className)} {...props}>
      <div className="relative">
        {media}
        {badges && <div className="absolute top-3 left-3 z-1">{badges}</div>}
        {actions && <div className="absolute top-3 right-3 z-1">{actions}</div>}
      </div>
      <div className="mt-4 min-w-0 text-pretty">{details}</div>
    </article>
  );
}
