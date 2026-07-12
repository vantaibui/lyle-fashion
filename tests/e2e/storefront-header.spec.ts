import { expect, test } from '@playwright/test';

const responsiveWidths = [320, 375, 390, 768, 1024, 1280, 1440];

test.describe('storefront header responsiveness', () => {
  for (const width of responsiveWidths) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width });
      await page.goto('/');
      await expect(page.getByRole('banner')).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    });
  }

  test('desktop mega menu opens without shifting the document', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto('/');
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.getByRole('button', { name: 'Nam' }).click();
    await expect(
      page.locator('#navigation-panel-men').getByText('Chất liệu tự nhiên,'),
    ).toBeVisible();
    expect(await page.evaluate(() => document.body.scrollHeight)).toBe(
      initialHeight,
    );
  });

  test('mobile drawer uses nested navigation and closes', async ({ page }) => {
    await page.setViewportSize({ height: 780, width: 375 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Mở menu' }).click();
    await page.getByRole('button', { name: 'Nữ' }).click();
    await expect(page.getByRole('heading', { name: 'Nữ' })).toBeVisible();
    await page.getByRole('button', { name: /Đóng ngăn kéo/ }).click();
    await expect(page.getByRole('button', { name: 'Mở menu' })).toBeFocused();
  });

  test('search overlay remains usable on a small phone', async ({ page }) => {
    await page.setViewportSize({ height: 700, width: 320 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Mở tìm kiếm' }).click();
    const search = page.getByRole('combobox', {
      name: 'Tìm kiếm sản phẩm và nội dung',
    });
    await expect(search).toBeFocused();
    await search.fill('Linen');
    await expect(
      page.getByRole('option', { name: 'Bộ sưu tập Linen' }),
    ).toBeVisible();
  });
});
