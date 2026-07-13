import Link from 'next/link';

import { ProductCardShell } from '@/components/commerce/product-card-shell';
import { ProductImage } from '@/components/commerce/product-image';
import { Price } from '@/components/ui/price';
import type { NewArrivalProduct } from '@/modules/marketing/home-content';

function discountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function SaleProductCard({ product }: { product: NewArrivalProduct }) {
  const percent = discountPercent(product.originalPrice, product.salePrice);

  return (
    <ProductCardShell
      badges={
        percent > 0 ? (
          <span className="bg-brand-sale text-2xs px-2 py-1 font-semibold tracking-wide text-white uppercase">
            Sale -{percent}%
          </span>
        ) : undefined
      }
      details={
        <div className="space-y-1.5 text-center">
          <Link
            className="text-text-strong hover:text-action-muted line-clamp-2 text-sm leading-snug transition-colors"
            href={product.href}
          >
            {product.name}
          </Link>
          <div className="flex items-center justify-center gap-2">
            <Price
              amount={product.salePrice}
              className="text-brand-sale text-sm font-semibold"
              label="Giá đặc biệt"
            />
            <Price
              amount={product.originalPrice}
              className="text-text-subtle text-xs line-through"
              label="Giá thông thường"
            />
          </div>
        </div>
      }
      media={
        <Link href={product.href}>
          <ProductImage
            alt={product.name}
            containerClassName="bg-surface-muted"
            sizes="(max-width: 48rem) 50vw, (max-width: 80rem) 25vw, 20vw"
            src={product.image}
          />
        </Link>
      }
    />
  );
}
