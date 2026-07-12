import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 12;
};

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  12: 'grid-cols-12',
};

export function Grid({
  children,
  className,
  columns = 12,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid gap-[var(--grid-gap-mobile)] lg:gap-[var(--grid-gap-desktop)]',
        columnClasses[columns],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
