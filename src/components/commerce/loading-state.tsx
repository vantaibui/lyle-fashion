import type { HTMLAttributes } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils/cn';

export type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  count?: number;
  label?: string;
};

export function LoadingState({
  className,
  count = 4,
  label = 'Đang tải sản phẩm…',
  ...props
}: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-live="polite" className={className} {...props}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <div
        className={cn(
          'grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-6',
        )}
      >
        {Array.from({ length: count }, (_, index) => (
          <div aria-hidden="true" className="grid gap-3" key={index}>
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
