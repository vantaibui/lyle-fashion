import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type StackProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const gaps = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-10',
};

export function Stack({
  as: Component = 'div',
  children,
  className,
  gap = 'md',
  ...props
}: StackProps) {
  return (
    <Component className={cn('flex flex-col', gaps[gap], className)} {...props}>
      {children}
    </Component>
  );
}
