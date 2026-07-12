import type { HTMLAttributes } from 'react';

import { formatVnd } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export type PriceProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  amount: number;
  label?: string;
};

export function Price({
  amount,
  className,
  label = 'Giá',
  ...props
}: PriceProps) {
  return (
    <span
      aria-label={`${label}: ${formatVnd(amount)}`}
      className={cn('font-ui tabular-nums', className)}
      translate="no"
      {...props}
    >
      {formatVnd(amount)}
    </span>
  );
}
