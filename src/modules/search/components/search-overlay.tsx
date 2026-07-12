'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Skeleton } from '@/components/ui/skeleton';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import type {
  SearchSuggestion,
  SearchSuggestionResult,
} from '@/modules/search/contracts/search-suggestions';
import { searchConfig } from '@/modules/search/search-config';
import { searchResultsHref } from '@/modules/search/utils/normalize-query';

import { useSearchSuggestions } from './use-search-suggestions';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const groupLabels: Array<[keyof SearchSuggestionResult, string]> = [
  ['products', 'Sản phẩm'],
  ['categories', 'Danh mục'],
  ['collections', 'Bộ sưu tập'],
  ['keywords', 'Từ khóa'],
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const listboxId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { error, normalizedQuery, result, retry, status } =
    useSearchSuggestions({
      debounceMs: searchConfig.debounceMs,
      enabled: isOpen,
      minimumQueryLength: searchConfig.minimumQueryLength,
      provider: searchConfig.provider,
      query,
    });
  const suggestions = useMemo(
    () => groupLabels.flatMap(([key]) => result[key]),
    [result],
  );
  const activeSuggestion = suggestions[activeIndex];

  useEffect(() => {
    if (status === 'success' && suggestions.length > 0) {
      noStorefrontAnalytics({
        name: 'search_suggestion_view',
        properties: { count: suggestions.length },
      });
    }
  }, [status, suggestions.length]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('global-search-input')?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  function remember(value: string) {
    setRecentSearches((current) =>
      [value, ...current.filter((item) => item !== value)].slice(0, 5),
    );
  }

  function navigateTo(href: string, source: string) {
    noStorefrontAnalytics({
      name: 'search_suggestion_select',
      properties: { source },
    });
    onClose();
    router.push(href);
  }

  function submitSearch() {
    const href = searchResultsHref(normalizedQuery);
    if (!href) return;
    remember(normalizedQuery);
    noStorefrontAnalytics({
      name: 'search_submit',
      properties: { queryLength: normalizedQuery.length },
    });
    onClose();
    router.push(href);
  }

  return (
    <Dialog
      className="m-0 mt-[max(1rem,env(safe-area-inset-top))] max-h-[calc(100dvh-2rem)] w-[min(70rem,calc(100%-2rem))] max-w-none"
      description="Tìm theo sản phẩm, danh mục, bộ sưu tập hoặc từ khóa."
      isLoading={status === 'loading'}
      isOpen={isOpen}
      onClose={onClose}
      title="Tìm kiếm"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        role="search"
      >
        <label className="sr-only" htmlFor="global-search-input">
          Tìm kiếm sản phẩm và nội dung
        </label>
        <Input
          aria-activedescendant={
            activeSuggestion
              ? `${listboxId}-option-${activeSuggestion.id}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={suggestions.length > 0}
          autoComplete="off"
          autoFocus
          className="min-h-14 border-x-0 border-t-0 px-0 text-lg"
          enterKeyHint="search"
          id="global-search-input"
          inputMode="search"
          name="q"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length > 0) {
              event.preventDefault();
              setActiveIndex((current) => (current + 1) % suggestions.length);
            }
            if (event.key === 'ArrowUp' && suggestions.length > 0) {
              event.preventDefault();
              setActiveIndex(
                (current) =>
                  (current - 1 + suggestions.length) % suggestions.length,
              );
            }
            if (event.key === 'Enter' && activeSuggestion) {
              event.preventDefault();
              remember(activeSuggestion.label);
              navigateTo(activeSuggestion.href, activeSuggestion.kind);
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              onClose();
            }
          }}
          placeholder="Tìm Linen, áo sơ mi, bộ sưu tập…"
          role="combobox"
          spellCheck={false}
          value={query}
        />
      </form>

      <VisuallyHidden aria-live="polite">
        {status === 'loading' && 'Đang tìm gợi ý.'}
        {status === 'success' && `${suggestions.length} gợi ý tìm kiếm.`}
        {status === 'error' && 'Không thể tải gợi ý tìm kiếm.'}
      </VisuallyHidden>

      <div className="mt-6 min-h-56">
        {status === 'idle' && (
          <SearchShortcuts
            popular={searchConfig.popularSearches}
            recent={recentSearches}
            select={setQuery}
          />
        )}
        {status === 'loading' && <SearchLoading />}
        {status === 'error' && (
          <ErrorState
            action={
              <button
                className="min-h-11 cursor-pointer border-0 bg-transparent font-medium underline underline-offset-4"
                onClick={retry}
                type="button"
              >
                Thử lại
              </button>
            }
            description={error?.message ?? 'Vui lòng thử lại.'}
          />
        )}
        {status === 'success' && suggestions.length === 0 && (
          <EmptyState
            className="py-8"
            description="Thử một từ khóa ngắn hơn hoặc kiểm tra lại chính tả."
            title="Chưa có gợi ý phù hợp"
          />
        )}
        {status === 'success' && suggestions.length > 0 && (
          <SuggestionGroups
            activeId={activeSuggestion?.id}
            listboxId={listboxId}
            navigate={navigateTo}
            result={result}
            setActive={(suggestion) =>
              setActiveIndex(
                suggestions.findIndex((item) => item.id === suggestion.id),
              )
            }
          />
        )}
      </div>
    </Dialog>
  );
}

function SearchShortcuts({
  popular,
  recent,
  select,
}: {
  popular: readonly string[];
  recent: string[];
  select: (value: string) => void;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {recent.length > 0 && (
        <ShortcutGroup label="Tìm gần đây" items={recent} select={select} />
      )}
      <ShortcutGroup
        label="Tìm kiếm phổ biến"
        items={[...popular]}
        select={select}
      />
    </div>
  );
}

function ShortcutGroup({
  items,
  label,
  select,
}: {
  items: string[];
  label: string;
  select: (value: string) => void;
}) {
  return (
    <section aria-labelledby={`search-shortcut-${label}`}>
      <h3
        className="text-text-subtle tracking-caps mb-3 text-xs font-medium uppercase"
        id={`search-shortcut-${label}`}
      >
        {label}
      </h3>
      <ul className="grid" role="list">
        {items.map((item) => (
          <li className="border-border-subtle border-b" key={item}>
            <button
              className="hover:text-action-muted min-h-11 w-full cursor-pointer border-0 bg-transparent text-left"
              onClick={() => select(item)}
              type="button"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchLoading() {
  return (
    <div aria-hidden="true" className="grid gap-4">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-4/5" />
      <Skeleton className="h-11 w-3/5" />
    </div>
  );
}

function SuggestionGroups({
  activeId,
  listboxId,
  navigate,
  result,
  setActive,
}: {
  activeId?: string;
  listboxId: string;
  navigate: (href: string, source: string) => void;
  result: SearchSuggestionResult;
  setActive: (suggestion: SearchSuggestion) => void;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2" id={listboxId} role="listbox">
      {groupLabels.map(([key, label]) =>
        result[key].length > 0 ? (
          <section aria-label={label} key={key} role="group">
            <h3 className="text-text-subtle tracking-caps mb-3 text-xs font-medium uppercase">
              {label}
            </h3>
            <ul className="grid" role="presentation">
              {result[key].map((suggestion) => (
                <li
                  className="border-border-subtle border-b"
                  key={suggestion.id}
                  role="presentation"
                >
                  <Link
                    aria-selected={activeId === suggestion.id}
                    className="aria-selected:bg-surface-muted min-h-12 w-full justify-between px-2 no-underline"
                    href={suggestion.href}
                    id={`${listboxId}-option-${suggestion.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(suggestion.href, suggestion.kind);
                    }}
                    onMouseMove={() => setActive(suggestion)}
                    role="option"
                  >
                    <span>{suggestion.label}</span>
                    {suggestion.detail && (
                      <span className="text-text-muted text-sm">
                        {suggestion.detail}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </div>
  );
}
