import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('marks the current page and exposes crawlable links', () => {
    render(
      <Pagination
        currentPage={2}
        getHref={(page) => `/shop?page=${page}`}
        totalPages={3}
      />,
    );
    expect(screen.getByRole('link', { name: 'Trang 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Trang 3' })).toHaveAttribute(
      'href',
      '/shop?page=3',
    );
  });
});
