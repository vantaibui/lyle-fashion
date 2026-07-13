'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';
import type { HeroSlide } from '@/modules/marketing/home-content';

const AUTOPLAY_MS = 5000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const count = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  useEffect(() => {
    if (count <= 1) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    timerRef.current = setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <section aria-label="Bộ sưu tập nổi bật" aria-roledescription="carousel">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <Link
              aria-hidden={index !== active}
              aria-label={slide.alt}
              aria-roledescription="slide"
              className="relative w-full shrink-0"
              href={slide.href}
              key={slide.desktopImage}
              tabIndex={index === active ? 0 : -1}
            >
              {/* Mobile crop */}
              <div className="relative aspect-[4/5] w-full md:hidden">
                <Image
                  alt={slide.alt}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  src={slide.mobileImage}
                />
              </div>
              {/* Desktop crop */}
              <div className="relative hidden aspect-[16/6] w-full md:block">
                <Image
                  alt={slide.alt}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  src={slide.desktopImage}
                />
              </div>
            </Link>
          ))}
        </div>

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                aria-current={index === active}
                aria-label={`Chuyển đến slide ${index + 1}`}
                className={cn(
                  'h-2 rounded-full transition-[width,background-color] duration-[var(--duration-normal)]',
                  index === active
                    ? 'bg-brand-sale w-6'
                    : 'w-2 bg-white/70 hover:bg-white',
                )}
                key={slide.desktopImage}
                onClick={() => goTo(index)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
