import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type BreadcrumbItem = {
  current?: boolean;
  href?: string;
  label: ReactNode;
};

export type BreadcrumbProps = {
  className?: string;
  items: BreadcrumbItem[];
  label?: string;
};

export function Breadcrumb({
  className,
  items,
  label = 'Đường dẫn',
}: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="text-text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => (
          <li
            className="flex min-w-0 items-center gap-2"
            key={`${String(item.label)}-${index}`}
          >
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.current || !item.href ? (
              <span
                aria-current={item.current ? 'page' : undefined}
                className={cn(item.current && 'text-text')}
              >
                {item.label}
              </span>
            ) : (
              <a
                className="hover:text-text inline-flex min-h-11 items-center underline underline-offset-4"
                href={item.href}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
