import { expect, test } from '@playwright/test';

test.describe('product PDP', () => {
  test('renders a simple product with canonical PDP behavior and variant selection', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 960, width: 1440 });
    await page.goto('/product/san-pham-minh-hoa-1?color=ink');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Áo sơ mi Linen tối giản' }),
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost:3000/product/san-pham-minh-hoa-1',
    );

    await page
      .locator('fieldset')
      .filter({ has: page.getByText(/^Kích thước$/) })
      .first()
      .locator('label')
      .filter({ hasText: /^M$/ })
      .click();
    await expect(page).toHaveURL(/color=ink.*size=m|size=m.*color=ink/);
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).click();
    await expect(page.getByText('Đã thêm vào giỏ minh hoạ')).toBeVisible();
  });

  test('requires size selection for every bundle component', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto('/product/san-pham-minh-hoa-7');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Bộ Linen thường ngày nam' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Thêm set vào giỏ' }).click();
    await expect(
      page.getByText('Kiểm tra lại kích thước của từng thành phần trong set.'),
    ).toBeVisible();

    const groups = page
      .locator('fieldset')
      .filter({ has: page.getByText(/^Chọn kích thước$/) });
    await groups.nth(0).locator('label').filter({ hasText: /^M$/ }).click();
    await groups.nth(1).locator('label').filter({ hasText: /^M$/ }).click();
    await page.getByRole('button', { name: 'Thêm set vào giỏ' }).click();
    await expect(page.getByText('Đã thêm set minh hoạ vào giỏ')).toBeVisible();
    await expect(groups.first()).toBeVisible();
  });
});
