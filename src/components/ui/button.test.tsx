import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import { IconButton } from './icon-button';

describe('Button', () => {
  it('prevents repeated activation and exposes loading state', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button isLoading onClick={onClick}>
        Thêm vào giỏ
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Đang xử lý…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('requires a visible accessibility contract for icon-only actions', () => {
    render(
      <IconButton label="Lưu sản phẩm">
        <span aria-hidden="true">♡</span>
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Lưu sản phẩm' })).toHaveClass(
      'min-h-[var(--touch-target-min)]',
      'min-w-[var(--touch-target-min)]',
    );
  });
});
