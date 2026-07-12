import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CatalogFilterFacet,
  CatalogSortOption,
} from '@/modules/catalog/contracts/catalog';

import { CatalogControls } from './catalog-controls';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const facets: CatalogFilterFacet[] = [
  {
    key: 'material',
    label: 'Chất liệu',
    options: [
      { count: 4, label: 'Linen', value: 'linen' },
      { count: 0, disabled: true, label: 'Lyocell', value: 'lyocell' },
    ],
  },
];
const sortOptions: CatalogSortOption[] = [
  { label: 'Đề xuất', value: 'recommended' },
  { label: 'Mới nhất', value: 'newest' },
];

beforeEach(() => push.mockReset());

describe('CatalogControls', () => {
  it('opens the mobile drawer and updates the URL from typed filter data', async () => {
    const user = userEvent.setup();
    render(
      <CatalogControls
        facets={facets}
        pathname="/shop"
        searchState={{ page: 1, sort: 'relevance' }}
        sortOptions={sortOptions}
        total={4}
      >
        <div>Products</div>
      </CatalogControls>,
    );
    await user.click(screen.getByRole('button', { name: 'Bộ lọc' }));
    const linenOptions = screen.getAllByRole('checkbox', { name: /Linen/ });
    await user.click(linenOptions.at(-1)!);
    expect(push).toHaveBeenCalledWith('/shop?material=linen', {
      scroll: false,
    });
  });

  it('removes one filter and clears all filters', async () => {
    const user = userEvent.setup();
    render(
      <CatalogControls
        facets={facets}
        pathname="/shop"
        searchState={{ material: ['linen'], page: 2, sort: 'newest' }}
        sortOptions={sortOptions}
        total={2}
      >
        <div>Products</div>
      </CatalogControls>,
    );
    await user.click(
      screen.getByRole('button', { name: 'Bỏ bộ lọc Chất liệu: Linen' }),
    );
    expect(push).toHaveBeenCalledWith('/shop?sort=newest', { scroll: false });
    await user.click(screen.getByRole('button', { name: 'Xóa tất cả' }));
    expect(push).toHaveBeenLastCalledWith('/shop?sort=newest', {
      scroll: false,
    });
  });

  it('changes sorting and resets pagination', async () => {
    const user = userEvent.setup();
    render(
      <CatalogControls
        facets={facets}
        pathname="/shop"
        searchState={{ page: 3, sort: 'recommended' }}
        sortOptions={sortOptions}
        total={4}
      >
        <div>Products</div>
      </CatalogControls>,
    );
    await user.selectOptions(
      screen.getAllByRole('combobox', { name: 'Sắp xếp theo' })[0]!,
      'newest',
    );
    expect(push).toHaveBeenCalledWith('/shop?sort=newest', { scroll: false });
  });
});
