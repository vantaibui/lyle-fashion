import type { HTMLAttributes } from 'react';

import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils/cn';

export type ProductPriceProps = HTMLAttributes<HTMLDivElement> & {
  amount: number;
  compareAtAmount?: number;
  isLoading?: boolean;
};

export function ProductPrice({
  amount,
  className,
  compareAtAmount,
  isLoading = false,
  ...props
}: ProductPriceProps) {
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="Đang tải giá…"
        className={cn(
          'bg-skeleton h-6 w-28 animate-pulse motion-reduce:animate-none',
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn('flex flex-wrap items-baseline gap-x-3 gap-y-1', className)}
      {...props}
    >
      <Price amount={amount} className="font-medium" />
      {compareAtAmount !== undefined && compareAtAmount > amount && (
        <Price
          amount={compareAtAmount}
          className="text-text-subtle text-sm line-through"
          label="Giá tham chiếu"
        />
      )}
    </div>
  );
}
