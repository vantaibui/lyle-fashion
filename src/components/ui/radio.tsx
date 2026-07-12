import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  description?: ReactNode;
};

export function Radio({ className, description, label, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-3 py-2',
        className,
      )}
    >
      <input
        className="border-border-strong accent-action mt-0.5 size-5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        type="radio"
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
