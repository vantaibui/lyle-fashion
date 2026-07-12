import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { cn } from '@/lib/utils/cn';

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> & {
  children?: ReactNode;
  label: string;
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export function IconButton({
  children,
  className,
  disabled,
  isLoading = false,
  label,
  ref,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-busy={isLoading || undefined}
      aria-label={label}
      className={cn(
        'border-border bg-surface text-text hover:border-border-strong hover:bg-surface-muted active:bg-brand-flax inline-flex min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)] cursor-pointer items-center justify-center rounded-full border transition-[background-color,border-color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
      disabled={disabled || isLoading}
      ref={ref}
      type={type}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
        />
      ) : (
        children
      )}
    </button>
  );
}
