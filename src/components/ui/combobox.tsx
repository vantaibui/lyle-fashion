'use client';

import { useId, useMemo, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

import { cn } from '@/lib/utils/cn';

export type ComboboxOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type ComboboxProps = {
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  value?: string;
};

export function Combobox({
  className,
  disabled = false,
  emptyMessage = 'Không tìm thấy lựa chọn.',
  errorMessage,
  label,
  name,
  onChange,
  options,
  placeholder = 'Tìm lựa chọn…',
  value,
}: ComboboxProps) {
  const id = useId();
  const [query, setQuery] = useState(
    () => options.find((option) => option.value === value)?.label ?? '',
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi-VN');
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLocaleLowerCase('vi-VN').includes(normalized),
    );
  }, [options, query]);

  function select(option: ComboboxOption) {
    if (option.disabled) return;
    setQuery(option.label);
    onChange(option.value);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function moveActive(direction: 1 | -1) {
    if (!filteredOptions.length) return;
    for (let step = 1; step <= filteredOptions.length; step += 1) {
      const next =
        (activeIndex + direction * step + filteredOptions.length) %
        filteredOptions.length;
      if (!filteredOptions[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      moveActive(-1);
    } else if (event.key === 'Enter' && isOpen && activeIndex >= 0) {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) select(option);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  return (
    <div className={cn('relative grid gap-2', className)}>
      <label className="text-sm font-medium" htmlFor={`${id}-input`}>
        {label}
      </label>
      <input name={name} type="hidden" value={value ?? ''} />
      <input
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        aria-expanded={isOpen}
        aria-invalid={Boolean(errorMessage) || undefined}
        autoComplete="off"
        className={cn(
          'border-border bg-surface text-text placeholder:text-text-subtle hover:border-border-strong min-h-[var(--control-height-md)] w-full rounded-xs border px-3 py-2 text-base',
          errorMessage && 'border-danger',
        )}
        disabled={disabled}
        id={`${id}-input`}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 100);
        }}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={query}
      />
      {isOpen && (
        <ul
          className="border-border bg-surface shadow-overlay absolute top-full z-[var(--z-dropdown)] mt-1 max-h-64 w-full overflow-y-auto overscroll-contain rounded-xs border p-1"
          id={`${id}-listbox`}
          role="listbox"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => (
              <li
                aria-disabled={option.disabled || undefined}
                aria-selected={option.value === value}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center rounded-xs px-3 py-2 text-sm break-words',
                  index === activeIndex && 'bg-surface-muted',
                  option.value === value && 'font-semibold',
                  option.disabled && 'cursor-not-allowed opacity-45',
                )}
                id={`${id}-option-${index}`}
                key={option.value}
                onMouseDown={(event) => {
                  event.preventDefault();
                  select(option);
                }}
                role="option"
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="text-text-muted px-3 py-3 text-sm" role="status">
              {emptyMessage}
            </li>
          )}
        </ul>
      )}
      {errorMessage && (
        <p className="text-danger text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
