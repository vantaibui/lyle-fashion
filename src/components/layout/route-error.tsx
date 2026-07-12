'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/commerce/error-state';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    // Only the framework digest is safe until a redacting logger is approved.
    console.error('Route boundary error', { digest: error.digest });
  }, [error.digest]);

  return (
    <main>
      <Section>
        <Container size="reading">
          <ErrorState
            action={<Button onClick={reset}>Thử lại</Button>}
            description="Nội dung chưa thể tải. Vui lòng thử lại sau."
          />
        </Container>
      </Section>
    </main>
  );
}
