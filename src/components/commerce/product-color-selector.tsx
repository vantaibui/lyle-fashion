'use client';

import { ColorSwatch } from '@/components/ui/color-swatch';
import { cn } from '@/lib/utils/cn';

export type ProductColorOption = {
  color: string;
  disabled?: boolean;
  label: string;
  value: string;
};

export type ProductColorSelectorProps = {
  className?: string;
  errorMessage?: string;
  label?: string;
  onChange: (value: string) => void;
  options: ProductColorOption[];
  value?: string;
};

export function ProductColorSelector({
  className,
  errorMessage,
  label = 'Màu sắc',
  onChange,
  options,
  value,
}: ProductColorSelectorProps) {
  return (
    <fieldset className={cn('grid gap-3', className)}>
      <legend className="text-sm font-medium">
        {label}
        {value && (
          <span className="text-text-muted ml-2 font-normal">
            {options.find((option) => option.value === value)?.label}
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ColorSwatch
            color={option.color}
            disabled={option.disabled}
            key={option.value}
            label={option.label}
            onClick={() => onChange(option.value)}
            selected={option.value === value}
          />
        ))}
      </div>
      {errorMessage && (
        <p className="text-danger text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
