import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { NavigationGroup } from '@/config/navigation';

import { MobileNavigation } from './mobile-navigation';

const groups: NavigationGroup[] = [
  {
    id: 'men',
    label: 'Nam',
    items: [{ href: '/men', label: 'Xem tất cả' }],
  },
];

describe('MobileNavigation', () => {
  it('moves forward into a submenu and back to the main menu', async () => {
    const user = userEvent.setup();
    render(<MobileNavigation groups={groups} />);

    await user.click(screen.getByRole('button', { name: 'Mở menu' }));
    await user.click(screen.getByRole('button', { name: 'Nam' }));
    expect(screen.getByRole('heading', { name: 'Nam' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Xem tất cả' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /Menu chính/ }));
    expect(screen.getByRole('button', { name: 'Nam' })).toBeVisible();
  });

  it('closes with Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<MobileNavigation groups={groups} />);
    const trigger = screen.getByRole('button', { name: 'Mở menu' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});
