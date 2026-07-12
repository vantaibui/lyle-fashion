import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  size?: 'content' | 'reading' | 'narrow';
};

export function Container({
  as: Component = 'div',
  children,
  className,
  size = 'content',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-[var(--gutter-mobile)] md:px-[var(--gutter-tablet)] lg:px-[var(--gutter-desktop)]',
        size === 'content' && 'max-w-[var(--container-content)]',
        size === 'reading' && 'max-w-[var(--container-reading)]',
        size === 'narrow' && 'max-w-[var(--container-narrow)]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
