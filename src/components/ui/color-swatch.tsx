'use client';

import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ColorSwatchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> & {
  color: string;
  label: string;
  selected?: boolean;
};

export function ColorSwatch({
  className,
  color,
  label,
  selected = false,
  type = 'button',
  ...props
}: ColorSwatchProps) {
  return (
    <button
      aria-label={`${label}${selected ? ', đã chọn' : ''}`}
      aria-pressed={selected}
      className={cn(
        'border-border bg-surface hover:border-border-strong inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border transition-[border-color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-35',
        selected &&
          'border-border-strong ring-border-strong ring-offset-background ring-1 ring-offset-2',
        className,
      )}
      type={type}
      {...props}
    >
      <span
        aria-hidden="true"
        className="border-border-strong size-6 rounded-full border"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}
