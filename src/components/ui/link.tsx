import NextLink from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

export type LinkProps = ComponentProps<typeof NextLink> & {
  variant?: 'default' | 'subtle' | 'inverse';
};

export function Link({ className, variant = 'default', ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        'decoration-border-strong inline-flex min-h-11 items-center text-pretty underline decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--duration-fast)]',
        variant === 'default' && 'text-text hover:text-action-muted',
        variant === 'subtle' && 'text-text-muted hover:text-text',
        variant === 'inverse' && 'text-text-inverse decoration-brand-flax',
        className,
      )}
      {...props}
    />
  );
}
