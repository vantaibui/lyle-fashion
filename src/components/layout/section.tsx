import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  spacing?: 'none' | 'compact' | 'default';
};

export function Section({
  children,
  className,
  spacing = 'default',
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacing === 'compact' && 'py-10 md:py-16',
        spacing === 'default' && 'py-[var(--section-space)]',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
