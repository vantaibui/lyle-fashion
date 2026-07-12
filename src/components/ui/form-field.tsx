import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  description?: ReactNode;
  htmlFor: string;
  label: ReactNode;
  optionalLabel?: string;
  required?: boolean;
};

export function FormField({
  children,
  className,
  description,
  htmlFor,
  label,
  optionalLabel = 'Không bắt buộc',
  required = false,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <label
        className="text-text flex items-baseline justify-between gap-3 text-sm font-medium"
        htmlFor={htmlFor}
      >
        <span>{label}</span>
        {!required && (
          <span className="text-text-subtle text-xs font-normal">
            {optionalLabel}
          </span>
        )}
      </label>
      {description && <p className="text-text-muted text-sm">{description}</p>}
      {children}
    </div>
  );
}

export type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: 'error' | 'help' | 'success';
};

export function FormMessage({
  className,
  role,
  tone = 'help',
  ...props
}: FormMessageProps) {
  return (
    <p
      className={cn(
        'text-sm break-words',
        tone === 'error' && 'text-danger',
        tone === 'help' && 'text-text-muted',
        tone === 'success' && 'text-success',
        className,
      )}
      role={role ?? (tone === 'error' ? 'alert' : undefined)}
      {...props}
    />
  );
}
