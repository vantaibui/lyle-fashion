import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-action bg-action text-text-inverse hover:border-action-hover hover:bg-action-hover active:border-action-active active:bg-action-active',
  secondary:
    'border-border-strong bg-transparent text-text hover:bg-surface-muted active:bg-brand-flax',
  quiet:
    'border-transparent bg-transparent text-text underline-offset-4 hover:bg-surface-muted hover:underline active:bg-brand-flax',
  danger:
    'border-danger bg-danger text-text-inverse hover:brightness-90 active:brightness-75',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--control-height-sm)] px-4 text-sm',
  md: 'min-h-[var(--control-height-md)] px-5 text-sm',
  lg: 'min-h-[var(--control-height-lg)] px-6 text-base',
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  loadingLabel = 'Đang xử lý…',
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={isLoading || undefined}
      className={cn(
        'font-ui ease-standard relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border font-medium tracking-wide transition-[background-color,border-color,color,filter] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
