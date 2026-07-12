import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { NavigationGroup } from '@/config/navigation';

import { DesktopNavigation } from './desktop-navigation';

vi.mock('next/navigation', () => ({ usePathname: () => '/men' }));

const groups: NavigationGroup[] = [
  {
    id: 'men',
    label: 'Nam',
    items: [{ href: '/men', label: 'Xem tất cả' }],
  },
  {
    id: 'women',
    label: 'Nữ',
    items: [{ href: '/women', label: 'Xem tất cả' }],
  },
];

describe('DesktopNavigation', () => {
  it('opens a menu, closes with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation groups={groups} />);
    const trigger = screen.getByRole('button', { name: 'Nam' });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowDown}');
    const panel = document.getElementById('navigation-panel-men');
    expect(panel).not.toBeNull();
    await waitFor(() => {
      expect(
        within(panel!).getByRole('link', { name: /Xem tất cả/ }),
      ).toHaveFocus();
    });
    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('moves between triggers with arrow keys', async () => {
    const user = userEvent.setup();
    render(<DesktopNavigation groups={groups} />);
    const men = screen.getByRole('button', { name: 'Nam' });
    const women = screen.getByRole('button', { name: 'Nữ' });
    men.focus();

    await user.keyboard('{ArrowRight}');
    expect(women).toHaveFocus();
  });

  it('closes after an outside pointer interaction', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DesktopNavigation groups={groups} />
        <button type="button">Bên ngoài</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Nam' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Bên ngoài' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
