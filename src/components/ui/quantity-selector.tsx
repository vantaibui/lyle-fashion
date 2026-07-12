'use client';

import { cn } from '@/lib/utils/cn';

import { IconButton } from './icon-button';

export type QuantitySelectorProps = {
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number;
};

export function QuantitySelector({
  className,
  disabled = false,
  isLoading = false,
  label = 'Số lượng',
  max = 99,
  min = 1,
  onChange,
  value,
}: QuantitySelectorProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        'border-border bg-surface inline-flex items-center rounded-xs border',
        className,
      )}
      role="group"
    >
      <IconButton
        className="rounded-none border-0"
        disabled={disabled || value <= min}
        label="Giảm số lượng"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <span aria-hidden="true">−</span>
      </IconButton>
      <output
        aria-live="polite"
        className="min-w-11 px-2 text-center text-sm tabular-nums"
      >
        {isLoading ? '…' : value}
      </output>
      <IconButton
        className="rounded-none border-0"
        disabled={disabled || value >= max}
        label="Tăng số lượng"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <span aria-hidden="true">+</span>
      </IconButton>
    </div>
  );
}
