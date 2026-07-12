import { expect, test } from '@playwright/test';

test.describe('catalog PLP', () => {
  test('server-renders the shop and supports crawlable pagination', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto('/shop');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Cửa hàng' }),
    ).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Danh sách sản phẩm' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Trang 2' }).click();
    await expect(page).toHaveURL(/\/shop\?page=2/);
    await expect(page.getByRole('link', { name: 'Trang 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('mobile filtering and sorting remain URL-driven', async ({ page }) => {
    await page.setViewportSize({ height: 800, width: 375 });
    await page.goto('/shop');
    await page.getByRole('button', { name: 'Bộ lọc' }).click();
    await page
      .getByRole('dialog')
      .locator('summary')
      .filter({ hasText: 'Chất liệu' })
      .click();
    await page.getByRole('checkbox', { name: 'Linen — Chất liệu' }).click();
    await expect(page).toHaveURL(/material=linen/);
    await page.getByRole('button', { name: /Xem \d+ sản phẩm/ }).click();

    await page.getByRole('button', { name: 'Sắp xếp' }).click();
    await page
      .getByRole('combobox', { name: 'Sắp xếp theo' })
      .selectOption('newest');
    await expect(page).toHaveURL(
      /material=linen.*sort=newest|sort=newest.*material=linen/,
    );
  });

  test('collection landing exposes breadcrumb and unique heading', async ({
    page,
  }) => {
    await page.goto('/collections/linen-collection');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Bộ sưu tập Linen' }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Đường dẫn' }),
    ).toContainText('Bộ sưu tập Linen');
  });
});
