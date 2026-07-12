import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { LoginForm } from '@/modules/auth/components/login-form';
import { safeReturnUrl } from '@/modules/auth/utils/safe-return-url';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Đăng nhập',
  robots: { index: false, follow: false },
};

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
            <h1 className="font-display text-3xl">Đăng nhập</h1>
            <p className="text-text-muted mt-2">
              Truy cập đơn hàng, địa chỉ và danh sách yêu thích của bạn.
            </p>
          </div>
          <LoginForm returnTo={safeReturnUrl(returnTo)} />
          <Link
            className="underline underline-offset-4"
            href="/forgot-password"
          >
            Quên mật khẩu?
          </Link>
          <aside className="bg-warning-surface border-warning border p-4 text-sm">
            <strong>Môi trường phát triển:</strong> demo@lyle.vn /
            LyleDemo!2026. Không dùng thông tin thật.
          </aside>
        </div>
      </Container>
    </Section>
  );
}
