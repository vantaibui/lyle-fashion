'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils/cn';

export type SizeOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SizeSelectorProps = {
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: SizeOption[];
  value?: string;
};

export function SizeSelector({
  className,
  disabled = false,
  errorMessage,
  label,
  name,
  onChange,
  options,
  value,
}: SizeSelectorProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function moveFocus(index: number, direction: 1 | -1) {
    for (let step = 1; step <= options.length; step += 1) {
      const next = (index + direction * step + options.length) % options.length;
      if (!options[next]?.disabled) {
        refs.current[next]?.focus();
        refs.current[next]?.click();
        return;
      }
    }
  }

  return (
    <fieldset className={cn('grid gap-3', className)} disabled={disabled}>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label className="relative cursor-pointer" key={option.value}>
            <input
              checked={value === option.value}
              className="peer sr-only"
              disabled={option.disabled}
              name={name}
              onChange={() => onChange(option.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  moveFocus(index, 1);
                }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  moveFocus(index, -1);
                }
              }}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="radio"
              value={option.value}
            />
            <span className="border-border bg-surface text-text hover:border-border-strong peer-checked:border-border-strong peer-checked:bg-action peer-checked:text-text-inverse peer-focus-visible:outline-focus inline-flex min-h-11 min-w-11 items-center justify-center rounded-xs border px-3 text-sm transition-[background-color,border-color,color] duration-[var(--duration-fast)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-disabled:cursor-not-allowed peer-disabled:opacity-35">
              {option.label}
            </span>
          </label>
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
