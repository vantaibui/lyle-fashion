import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ProductGridShellProps = HTMLAttributes<HTMLUListElement> & {
  children: ReactNode;
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

export function ProductGridShell({
  children,
  className,
  columns = 4,
  ...props
}: ProductGridShellProps) {
  return (
    <ul
      className={cn(
        'grid gap-x-[var(--product-grid-gap-x)] gap-y-[var(--product-grid-gap-y)]',
        columnClasses[columns],
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ProductGridItem({ children }: { children: ReactNode }) {
  return <li className="min-w-0">{children}</li>;
}
