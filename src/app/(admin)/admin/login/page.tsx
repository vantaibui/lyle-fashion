import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { AdminLoginForm } from '@/modules/admin-auth/components/admin-login-form';
import { safeAdminReturnUrl } from '@/modules/admin-auth/utils/safe-admin-return-url';
import { createRouteMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';
export const metadata = createRouteMetadata({
  description: 'Đăng nhập khu vực quản trị LYLE Fashion.',
  pathname: '/admin/login',
  title: 'Đăng nhập quản trị',
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  return (
    <Section>
      <Container size="narrow">
        <div className="border-border grid gap-6 border p-6 md:p-10">
          <div>
            <h1 className="font-display text-3xl">Đăng nhập quản trị</h1>
            <p className="text-text-muted mt-2">
              Khu vực dành riêng cho nhân viên LYLE Fashion. Phiên đăng nhập
              tách biệt với tài khoản khách hàng.
            </p>
          </div>
          <AdminLoginForm returnTo={safeAdminReturnUrl(returnTo)} />
          <aside className="bg-warning-surface border-warning border p-4 text-sm">
            <strong>Môi trường phát triển:</strong> admin@lyle.vn /
            LyleAdmin!2026. Không dùng thông tin thật.
          </aside>
        </div>
      </Container>
    </Section>
  );
}
