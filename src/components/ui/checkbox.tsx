import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: ReactNode;
  description?: ReactNode;
  isInvalid?: boolean;
};

export function Checkbox({
  className,
  description,
  isInvalid = false,
  label,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'group flex min-h-11 cursor-pointer items-start gap-3 py-2',
        className,
      )}
    >
      <input
        aria-invalid={isInvalid || undefined}
        className="border-border-strong accent-action mt-0.5 size-5 shrink-0 cursor-pointer rounded-xs border disabled:cursor-not-allowed"
        type="checkbox"
        {...props}
      />
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
    </label>
  );
}
