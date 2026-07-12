import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'role' | 'type'
> & {
  label: ReactNode;
  description?: ReactNode;
};

export function Switch({
  className,
  description,
  label,
  ...props
}: SwitchProps) {
  return (
    <label
      className={cn(
        'group flex min-h-11 cursor-pointer items-center justify-between gap-4 py-2',
        className,
      )}
    >
      <span className="min-w-0">
        <span className="text-text block text-sm font-medium break-words">
          {label}
        </span>
        {description && (
          <span className="text-text-muted mt-1 block text-sm break-words">
            {description}
          </span>
        )}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          className="peer sr-only"
          role="switch"
          type="checkbox"
          {...props}
        />
        <span className="border-border-strong bg-surface-muted peer-checked:bg-action peer-focus-visible:outline-focus h-7 w-12 rounded-full border transition-[background-color] duration-[var(--duration-fast)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-disabled:cursor-not-allowed peer-disabled:opacity-45" />
        <span className="bg-surface shadow-subtle ease-standard pointer-events-none absolute top-1 left-1 size-5 rounded-full transition-transform duration-[var(--duration-fast)] peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
