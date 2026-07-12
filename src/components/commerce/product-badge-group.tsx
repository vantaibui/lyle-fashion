import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ProductBadgeGroupProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function ProductBadgeGroup({
  children,
  className,
  label = 'Nhãn sản phẩm',
}: ProductBadgeGroupProps) {
  return (
    <div
      aria-label={label}
      className={cn('flex flex-wrap gap-x-3 gap-y-2', className)}
      role="group"
    >
      {children}
    </div>
  );
}
