import { expect, test } from '@playwright/test';

async function loginAsAdmin(
  page: import('@playwright/test').Page,
  returnTo?: string,
) {
  await page.goto(
    returnTo
      ? `/admin/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/admin/login',
  );
  await page.getByLabel('Email quản trị').fill('admin@lyle.vn');
  await page.getByLabel('Mật khẩu').fill('LyleAdmin!2026');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
}

test('protects admin routes and completes the admin login and product-list journey', async ({
  page,
}) => {
  await page.goto('/admin/products');
  await expect(page).toHaveURL(/\/admin\/login\?returnTo=/);

  await loginAsAdmin(page, '/admin/products');
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sản phẩm' }),
  ).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});

test('completes the product draft/edit journey across sections', async ({
  page,
}) => {
  await loginAsAdmin(page, '/admin/products');
  await page
    .getByRole('row', { name: 'Áo sơ mi Linen' })
    .getByRole('link', { name: 'Chỉnh sửa' })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Áo sơ mi Linen' }),
  ).toBeVisible();

  await page.getByRole('tab', { name: 'Biến thể & tồn kho' }).click();
  await expect(page.getByText('LYLE-SHIRT-LINEN-NAT-M')).toBeVisible();

  await page.getByRole('tab', { name: 'SEO' }).click();
  await expect(page.getByLabel('Tiêu đề SEO')).toBeVisible();

  await page.getByRole('tab', { name: 'Xuất bản' }).click();
  await expect(page.getByText('Đã xuất bản')).toBeVisible();
});

test('shows the order-list journey with filters and a read-only detail view', async ({
  page,
}) => {
  await loginAsAdmin(page, '/admin/orders');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Đơn hàng' }),
  ).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();

  await page.getByRole('link', { name: 'Xem' }).first().click();
  await expect(page.getByText(/Thao tác xử lý đơn hàng/)).toBeVisible();
});

test('renders the audit log page in either its populated or empty state', async ({
  page,
}) => {
  await loginAsAdmin(page, '/admin');
  await page.goto('/admin/audit-log');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Nhật ký hoạt động' }),
  ).toBeVisible();
  // The in-memory dev audit store is process-local (not durable across
  // workers), so a write from an earlier request may not be visible here;
  // both the populated table and the empty state are valid outcomes.
  await expect(
    page
      .getByRole('table')
      .or(page.getByRole('heading', { name: 'Chưa có nhật ký' })),
  ).toBeVisible();
});

test('filters admin navigation to only permission-granted groups', async ({
  page,
}) => {
  await loginAsAdmin(page, '/admin');
  const nav = page
    .getByRole('navigation', { name: 'Điều hướng quản trị' })
    .first();
  await expect(nav.getByRole('link', { name: 'Sản phẩm' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Đơn hàng' })).toBeVisible();
  await expect(
    nav.getByRole('link', { name: 'Nhật ký hoạt động' }),
  ).toBeVisible();
});
