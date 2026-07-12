import { expect, test } from '@playwright/test';

test('protects account routes and completes the account journey', async ({
  page,
}) => {
  await page.goto('/account/orders');
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.getByLabel('Email').fill('demo@lyle.vn');
  await page.getByLabel('Mật khẩu').fill('LyleDemo!2026');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page).toHaveURL(/\/account\/orders$/);
  await expect(page.getByRole('heading', { name: 'Đơn hàng' })).toBeVisible();
  await page.getByRole('link', { name: 'Xem chi tiết' }).click();
  await expect(
    page.getByRole('heading', { name: /Đơn LYLE-DEMO/ }),
  ).toBeVisible();
});

test('guest tracking keeps failures generic and returns minimal success', async ({
  page,
}) => {
  await page.goto('/order-tracking');
  await page.getByLabel('Mã đơn hàng').fill('LYLE-DEMO-2401');
  await page.getByLabel('Thông tin xác minh').fill('0000000000');
  await page.getByRole('button', { name: 'Tra cứu đơn hàng' }).click();
  await expect(
    page.getByText('Không thể xác minh thông tin tra cứu.'),
  ).toBeVisible();
  await page.getByLabel('Thông tin xác minh').fill('0901234567');
  await page.getByRole('button', { name: 'Tra cứu đơn hàng' }).click();
  await expect(
    page.getByRole('heading', { name: 'Trạng thái giao hàng' }),
  ).toBeVisible();
  await expect(page.getByText('12 Nguyễn Huệ')).toHaveCount(0);
});

test('submits an eligible return request', async ({ page }) => {
  await page.goto('/login?returnTo=/account/returns');
  await page.getByLabel('Email').fill('demo@lyle.vn');
  await page.getByLabel('Mật khẩu').fill('LyleDemo!2026');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.getByLabel('Lý do').selectOption('wrong_size');
  await page.getByRole('button', { name: 'Gửi yêu cầu' }).click();
  await expect(page.getByText('Đã gửi yêu cầu đổi trả.')).toBeVisible();
});
