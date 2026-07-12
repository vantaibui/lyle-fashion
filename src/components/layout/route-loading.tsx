import { LoadingState } from '@/components/commerce/loading-state';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';

export function RouteLoading() {
  return (
    <main>
      <Section>
        <Container>
          <LoadingState label="Đang tải nội dung…" />
        </Container>
      </Section>
    </main>
  );
}
