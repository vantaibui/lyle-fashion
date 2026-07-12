'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type TooltipProps = {
  children: ReactNode;
  className?: string;
  content: ReactNode;
};

export function Tooltip({ children, className, content }: TooltipProps) {
  const id = useId();

  return (
    <span className={cn('group relative inline-flex', className)}>
      <span aria-describedby={id} className="inline-flex" tabIndex={0}>
        {children}
      </span>
      <span
        className="bg-surface-inverse text-text-inverse shadow-overlay pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-[var(--z-tooltip)] hidden w-max max-w-64 -translate-x-1/2 rounded-xs px-3 py-2 text-xs group-focus-within:block group-hover:block"
        id={id}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
