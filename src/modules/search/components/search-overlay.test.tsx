import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SearchOverlay } from './search-overlay';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  vi.useRealTimers();
  push.mockReset();
});

describe('SearchOverlay', () => {
  it('navigates to the encoded URL for a normalized query', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SearchOverlay isOpen onClose={onClose} />);
    const input = screen.getByRole('combobox', {
      name: 'Tìm kiếm sản phẩm và nội dung',
    });
    await user.type(input, '  Áo   Linen  ');
    await user.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith('/search?q=%C3%81o+Linen');
    expect(onClose).toHaveBeenCalled();
  });

  it('supports arrow-key selection and Enter', async () => {
    const user = userEvent.setup();
    render(<SearchOverlay isOpen onClose={() => undefined} />);
    const input = screen.getByRole('combobox', {
      name: 'Tìm kiếm sản phẩm và nội dung',
    });
    await user.type(input, 'Linen');
    await screen.findByText('Bộ sưu tập Linen');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(push).toHaveBeenCalled();
  });

  it('shows a directed empty state', async () => {
    const user = userEvent.setup();
    render(<SearchOverlay isOpen onClose={() => undefined} />);
    await user.type(
      screen.getByRole('combobox', {
        name: 'Tìm kiếm sản phẩm và nội dung',
      }),
      'không-tồn-tại',
    );
    expect(
      await screen.findByRole('heading', { name: 'Chưa có gợi ý phù hợp' }),
    ).toBeVisible();
  });
});
