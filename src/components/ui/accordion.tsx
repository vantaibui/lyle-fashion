import type { DetailsHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type AccordionProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  children: ReactNode;
  title: ReactNode;
};

export function Accordion({
  children,
  className,
  title,
  ...props
}: AccordionProps) {
  return (
    <details
      className={cn('group border-border-subtle border-b', className)}
      {...props}
    >
      <summary className="hover:text-action-muted flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium transition-colors duration-[var(--duration-fast)] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 text-pretty">{title}</span>
        <span
          aria-hidden="true"
          className="shrink-0 transition-transform duration-[var(--duration-normal)] group-open:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </summary>
      <div className="text-text-muted pb-5 text-pretty">{children}</div>
    </details>
  );
}
