import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ProductBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  emphasis?: 'quiet' | 'strong';
};

export function ProductBadge({
  className,
  emphasis = 'quiet',
  ...props
}: ProductBadgeProps) {
  return (
    <span
      className={cn(
        'text-2xs tracking-caps inline-flex max-w-full items-center border-b py-1 leading-snug font-semibold break-words uppercase',
        emphasis === 'quiet' && 'border-brand-flax text-text-muted',
        emphasis === 'strong' && 'border-brand-ink text-text',
        className,
      )}
      {...props}
    />
  );
}
