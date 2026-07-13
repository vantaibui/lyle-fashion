import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { promoTiles } from '@/modules/marketing/home-content';

export function PromoTiles() {
  return (
    <Container className="py-6 md:py-10">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {promoTiles.map((tile) => (
          <Link
            className="group relative block overflow-hidden"
            href={tile.href}
            key={tile.image}
          >
            <div className="relative aspect-[3/4]">
              <Image
                alt={tile.alt}
                className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-105"
                fill
                sizes="(max-width: 48rem) 50vw, 25vw"
                src={tile.image}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-sm font-semibold tracking-wide text-white uppercase md:text-base">
                {tile.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
