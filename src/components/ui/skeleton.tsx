import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-skeleton animate-pulse rounded-xs motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}
