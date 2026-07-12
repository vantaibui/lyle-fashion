import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Stack } from '@/components/layout/stack';

type RoutePlaceholderProps = {
  description: string;
  eyebrow?: string;
  title: string;
};

export function RoutePlaceholder({
  description,
  eyebrow = 'Nền tảng LYLE Fashion',
  title,
}: RoutePlaceholderProps) {
  return (
    <main>
      <Section>
        <Container size="reading">
          <Stack gap="md">
            <p className="text-text-muted text-sm font-medium tracking-widest uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-tight text-balance md:text-5xl">
              {title}
            </h1>
            <p className="text-text-muted max-w-prose text-lg text-pretty">
              {description}
            </p>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
