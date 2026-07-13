import Image from 'next/image';

import { Container } from '@/components/layout/container';
import { snapEntries } from '@/modules/marketing/home-content';
import { SectionHeading } from '@/modules/marketing/components/section-heading';

export function SnapGallery() {
  return (
    <Container className="py-10 md:py-16">
      <SectionHeading title="Snap — Gợi ý phối đồ từ nhân viên" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {snapEntries.map((entry) => (
          <figure className="group" key={entry.name}>
            <div className="bg-surface-muted relative aspect-[3/4] overflow-hidden">
              <Image
                alt={`${entry.name} — ${entry.store}`}
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-105"
                fill
                sizes="(max-width: 48rem) 50vw, 25vw"
                src={entry.image}
              />
            </div>
            <figcaption className="mt-2 text-center">
              <p className="text-text-strong text-sm font-medium">
                {entry.name}
              </p>
              <p className="text-text-subtle text-xs">
                {entry.height} · {entry.store}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}
