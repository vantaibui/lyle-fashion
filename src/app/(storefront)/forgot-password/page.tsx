import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { ForgotPasswordForm } from '@/modules/auth/components/forgot-password-form';

export const metadata = {
  title: 'Quên mật khẩu',
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <Section>
      <Container size="narrow">
        <div className="border-border grid gap-6 border p-6 md:p-10">
          <div>
            <h1 className="font-display text-3xl">Đặt lại mật khẩu</h1>
            <p className="text-text-muted mt-2">
              Nhập email. Phản hồi luôn giống nhau để bảo vệ tài khoản.
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </Container>
    </Section>
  );
}
