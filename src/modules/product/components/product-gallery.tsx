'use client';

import { useState } from 'react';

import { ProductImage } from '@/components/commerce/product-image';
import { Dialog } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import type { CatalogImage } from '@/modules/catalog/contracts/catalog';

export function ProductGallery({
  images,
  productName,
}: {
  images: CatalogImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) return null;

  return (
    <>
      <div className="grid gap-4">
        <div className="md:hidden">
          <div
            aria-label={`Bộ ảnh của ${productName}`}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
            role="region"
          >
            {images.map((image, index) => (
              <button
                className="relative w-full min-w-full snap-center text-left"
                key={`${image.src}-${index}`}
                onClick={() => {
                  setActiveIndex(index);
                  setIsZoomOpen(true);
                }}
                type="button"
              >
                <ProductImage
                  alt={image.alt}
                  aspectRatio="portrait"
                  priority={index === 0}
                  sizes="100vw"
                  src={image.src}
                />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              Ảnh {activeIndex + 1}/{images.length}
            </p>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  className="bg-border-subtle data-[active=true]:bg-text h-1.5 w-6 rounded-full"
                  data-active={index === activeIndex}
                  key={`${image.src}-indicator`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-[5rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            {images.map((image, index) => (
              <button
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={index === activeIndex}
                className="border-border-subtle data-[active=true]:border-border-strong overflow-hidden border"
                data-active={index === activeIndex}
                key={`${image.src}-thumb`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <ProductImage
                  alt=""
                  aria-hidden="true"
                  aspectRatio="portrait"
                  sizes="80px"
                  src={image.src}
                />
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              className="block w-full text-left"
              onClick={() => setIsZoomOpen(true)}
              type="button"
            >
              <ProductImage
                alt={activeImage.alt}
                aspectRatio="portrait"
                priority
                sizes="(max-width: 64rem) 100vw, 60vw"
                src={activeImage.src}
              />
            </button>
            <div className="absolute right-4 bottom-4">
              <IconButton
                label="Phóng to hình ảnh"
                onClick={() => setIsZoomOpen(true)}
              >
                <span aria-hidden="true">+</span>
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        description="Phóng to để xem bề mặt vải và chi tiết dựng phom."
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={productName}
      >
        <div className="grid gap-4">
          <ProductImage
            alt={activeImage.alt}
            aspectRatio="portrait"
            sizes="100vw"
            src={activeImage.src}
          />
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <button
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={index === activeIndex}
                className="border-border-subtle data-[active=true]:border-border-strong w-20 overflow-hidden border"
                data-active={index === activeIndex}
                key={`${image.src}-zoom`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <ProductImage
                  alt=""
                  aria-hidden="true"
                  aspectRatio="portrait"
                  sizes="80px"
                  src={image.src}
                />
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
