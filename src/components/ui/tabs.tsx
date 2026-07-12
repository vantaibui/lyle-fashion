'use client';

import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export type TabItem = {
  content: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type TabsProps = {
  className?: string;
  defaultValue?: string;
  label: string;
  onChange?: (value: string) => void;
  tabs: TabItem[];
};

export function Tabs({
  className,
  defaultValue,
  label,
  onChange,
  tabs,
}: TabsProps) {
  const id = useId();
  const [value, setValue] = useState(
    defaultValue ?? tabs.find((tab) => !tab.disabled)?.value ?? '',
  );
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(nextValue: string) {
    setValue(nextValue);
    onChange?.(nextValue);
  }

  function move(index: number, direction: 1 | -1) {
    for (let step = 1; step <= tabs.length; step += 1) {
      const next = (index + direction * step + tabs.length) % tabs.length;
      if (!tabs[next]?.disabled) {
        refs.current[next]?.focus();
        select(tabs[next]?.value ?? '');
        return;
      }
    }
  }

  const selected = tabs.find((tab) => tab.value === value);

  return (
    <div className={className}>
      <div
        aria-label={label}
        className="border-border flex gap-6 overflow-x-auto border-b"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            aria-controls={`${id}-panel-${index}`}
            aria-selected={tab.value === value}
            className={cn(
              'text-text-muted hover:text-text relative min-h-11 shrink-0 cursor-pointer border-b-2 border-transparent px-1 text-sm font-medium transition-[border-color,color] duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-40',
              tab.value === value && 'border-border-strong text-text',
            )}
            disabled={tab.disabled}
            id={`${id}-tab-${index}`}
            key={tab.value}
            onClick={() => select(tab.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                move(index, 1);
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                move(index, -1);
              }
            }}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="tab"
            tabIndex={tab.value === value ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {selected && (
        <div
          aria-labelledby={`${id}-tab-${tabs.indexOf(selected)}`}
          className="py-6"
          id={`${id}-panel-${tabs.indexOf(selected)}`}
          role="tabpanel"
          tabIndex={0}
        >
          {selected.content}
        </div>
      )}
    </div>
  );
}
