import Image from 'next/image';
import type { ImageProps } from 'next/image';

import { cn } from '@/lib/utils/cn';

export type ProductImageProps = Omit<
  ImageProps,
  'fill' | 'height' | 'width'
> & {
  aspectRatio?: 'portrait' | 'square' | 'editorial';
  containerClassName?: string;
};

export function ProductImage({
  alt,
  aspectRatio = 'portrait',
  className,
  containerClassName,
  sizes = '(max-width: 48rem) 50vw, (max-width: 80rem) 33vw, 25vw',
  ...props
}: ProductImageProps) {
  return (
    <div
      className={cn(
        'bg-surface-muted relative overflow-hidden',
        aspectRatio === 'portrait' && 'aspect-[4/5]',
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === 'editorial' && 'aspect-[3/4]',
        containerClassName,
      )}
    >
      <Image
        alt={alt}
        className={cn('object-cover', className)}
        fill
        sizes={sizes}
        {...props}
      />
    </div>
  );
}
