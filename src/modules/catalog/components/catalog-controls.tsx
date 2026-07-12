'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer } from '@/components/ui/drawer';
import { Select } from '@/components/ui/select';
import type {
  CatalogFilterFacet,
  CatalogFilterKey,
  CatalogSortOption,
} from '@/modules/catalog/contracts/catalog';
import {
  catalogHref,
  clearCatalogFilters,
  withCatalogFilter,
  withCatalogSort,
  withoutCatalogFilter,
} from '@/modules/catalog/utils/catalog-url';
import type { ProductSearchState } from '@/lib/validation/search-params';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';

type CatalogControlsProps = {
  children: ReactNode;
  facets: CatalogFilterFacet[];
  hiddenFilterKeys?: CatalogFilterKey[];
  pathname: string;
  searchState: ProductSearchState;
  sortOptions: CatalogSortOption[];
  total: number;
};

export function CatalogControls({
  children,
  facets,
  hiddenFilterKeys = [],
  pathname,
  searchState,
  sortOptions,
  total,
}: CatalogControlsProps) {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const visibleFacets = facets.filter(
    (facet) => !hiddenFilterKeys.includes(facet.key),
  );
  const activeFilters = visibleFacets.flatMap((facet) =>
    (searchState[facet.key] ?? []).flatMap((value) => {
      const option = facet.options.find((item) => item.value === value);
      return option ? [{ facet, option }] : [];
    }),
  );

  function navigate(state: ProductSearchState) {
    startTransition(() =>
      router.push(catalogHref(pathname, state), { scroll: false }),
    );
  }

  const filterList = (
    <div className="divide-border-subtle divide-y">
      {visibleFacets.map((facet, index) => (
        <details className="group py-4" key={facet.key} open={index < 3}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
            {facet.label}
            <span aria-hidden="true" className="group-open:rotate-45">
              +
            </span>
          </summary>
          <fieldset className="mt-2 border-0 p-0">
            <legend className="sr-only">{facet.label}</legend>
            {facet.options.map((option) => {
              const selected =
                searchState[facet.key]?.includes(option.value) ?? false;
              return (
                <Checkbox
                  aria-label={`${option.label} — ${facet.label}`}
                  checked={selected}
                  description={
                    option.count === undefined
                      ? undefined
                      : `${option.count} sản phẩm`
                  }
                  disabled={option.disabled && !selected}
                  key={option.value}
                  label={option.label}
                  name={facet.key}
                  onChange={(event) => {
                    noStorefrontAnalytics({
                      name: 'filter_products',
                      properties: { filter: facet.key },
                    });
                    navigate(
                      withCatalogFilter(
                        searchState,
                        facet.key,
                        option.value,
                        event.target.checked,
                      ),
                    );
                  }}
                  value={option.value}
                />
              );
            })}
          </fieldset>
        </details>
      ))}
    </div>
  );

  return (
    <>
      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-3 border-y py-3 lg:hidden">
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterOpen(true)}
            size="sm"
            variant="secondary"
          >
            Bộ lọc{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
          </Button>
          <Button
            onClick={() => setSortOpen(true)}
            size="sm"
            variant="secondary"
          >
            Sắp xếp
          </Button>
        </div>
        <p aria-live="polite" className="text-text-muted text-sm">
          {total} sản phẩm
        </p>
      </div>

      {activeFilters.length > 0 && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          aria-label="Bộ lọc đang chọn"
        >
          {activeFilters.map(({ facet, option }) => (
            <button
              aria-label={`Bỏ bộ lọc ${facet.label}: ${option.label}`}
              className="border-border bg-surface hover:border-border-strong inline-flex min-h-11 max-w-56 cursor-pointer items-center gap-2 rounded-xs border px-3 text-sm"
              key={`${facet.key}-${option.value}`}
              onClick={() =>
                navigate(
                  withoutCatalogFilter(searchState, facet.key, option.value),
                )
              }
              title={`${facet.label}: ${option.label}`}
              type="button"
            >
              <span className="truncate">{option.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <Button
            disabled={isPending}
            onClick={() => navigate(clearCatalogFilters(searchState))}
            size="sm"
            variant="quiet"
          >
            Xóa tất cả
          </Button>
        </div>
      )}

      <Drawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        side="left"
        title="Bộ lọc"
      >
        {filterList}
        <div className="bg-surface sticky bottom-0 mt-5 grid gap-2 border-t pt-4 pb-[env(safe-area-inset-bottom)]">
          <Button onClick={() => setFilterOpen(false)}>
            Xem {total} sản phẩm
          </Button>
          {activeFilters.length > 0 && (
            <Button
              onClick={() => navigate(clearCatalogFilters(searchState))}
              variant="quiet"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
      </Drawer>

      <Drawer
        isOpen={sortOpen}
        onClose={() => setSortOpen(false)}
        title="Sắp xếp"
      >
        <SortSelect
          isPending={isPending}
          onChange={(sort) => {
            navigate(withCatalogSort(searchState, sort));
            setSortOpen(false);
          }}
          options={sortOptions}
          value={
            searchState.sort === 'relevance'
              ? 'recommended'
              : (searchState.sort ?? 'recommended')
          }
        />
      </Drawer>

      <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-12">
        <aside aria-label="Bộ lọc sản phẩm" className="hidden lg:block">
          <div className="sticky top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain pr-4">
            <h2 className="font-display text-xl">Bộ lọc</h2>
            {filterList}
          </div>
        </aside>
        <div className="min-w-0">
          <div className="mb-6 hidden items-end justify-between gap-6 lg:flex">
            <p aria-live="polite" className="text-text-muted text-sm">
              {total} sản phẩm
            </p>
            <SortSelect
              isPending={isPending}
              onChange={(sort) => {
                noStorefrontAnalytics({
                  name: 'sort_products',
                  properties: { sort },
                });
                navigate(withCatalogSort(searchState, sort));
              }}
              options={sortOptions}
              value={
                searchState.sort === 'relevance'
                  ? 'recommended'
                  : (searchState.sort ?? 'recommended')
              }
            />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

function SortSelect({
  isPending,
  onChange,
  options,
  value,
}: {
  isPending: boolean;
  onChange: (value: CatalogSortOption['value']) => void;
  options: CatalogSortOption[];
  value: CatalogSortOption['value'];
}) {
  return (
    <label className="grid min-w-56 gap-1 text-sm font-medium">
      Sắp xếp theo
      <Select
        disabled={isPending}
        name="sort"
        onChange={(event) =>
          onChange(event.target.value as CatalogSortOption['value'])
        }
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
