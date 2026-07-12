import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  decorative?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      aria-orientation={orientation}
      className={cn(
        'bg-border-subtle border-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full min-h-6 w-px',
        className,
      )}
      role={decorative ? 'none' : 'separator'}
      {...props}
    />
  );
}
