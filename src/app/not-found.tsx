import { EmptyState } from '@/components/commerce/empty-state';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Link } from '@/components/ui/link';

export default function NotFound() {
  return (
    <main>
      <Section>
        <Container size="reading">
          <EmptyState
            action={<Link href="/">Về trang chủ</Link>}
            description="Nội dung bạn yêu cầu không tồn tại hoặc đã được di chuyển."
            title="Không tìm thấy trang"
          />
        </Container>
      </Section>
    </main>
  );
}
