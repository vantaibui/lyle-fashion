'use client';

import Image from 'next/image';

import { Price } from '@/components/ui/price';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import type { CartLine } from '@/modules/cart/contracts/cart';

type CartLineItemProps = {
  line: CartLine;
  mutationLabel?: string;
  onMoveToWishlist?: (lineId: string) => void;
  onQuantityChange?: (lineId: string, quantity: number) => void;
  onRemove?: (lineId: string) => void;
};

export function CartLineItem({
  line,
  mutationLabel,
  onMoveToWishlist,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  return (
    <article className="border-border-subtle grid gap-4 border-b pb-5">
      <div className="grid gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
        <div className="bg-surface-muted relative aspect-[4/5] overflow-hidden">
          <Image
            alt={line.imageAlt}
            className="object-cover"
            fill
            sizes="96px"
            src={line.imageSrc}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <h3 className="font-medium text-pretty">{line.productName}</h3>
            <div className="text-text-muted grid gap-1 text-sm">
              {line.selectedColor ? <p>Màu: {line.selectedColor}</p> : null}
              {line.selectedSize ? <p>Cỡ: {line.selectedSize}</p> : null}
              {line.bundleGroupId ? (
                <p>Nhóm set: {line.bundleGroupId}</p>
              ) : null}
            </div>
          </div>
          {line.bundleComponentData && line.bundleComponentData.length > 0 ? (
            <ul className="text-text-muted grid gap-1 text-sm">
              {line.bundleComponentData.map((component) => (
                <li key={component.componentId}>
                  {component.title}: {component.selectedSize} ·{' '}
                  {component.selectedColor}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <Price amount={line.price} />
            {typeof line.compareAtPrice === 'number' &&
            line.compareAtPrice > line.price ? (
              <span className="text-text-subtle text-sm line-through">
                <Price amount={line.compareAtPrice} />
              </span>
            ) : null}
          </div>
          {line.validationMessages.length > 0 ? (
            <ul className="text-danger grid gap-1 text-sm" role="alert">
              {line.validationMessages.map((message, index) => (
                <li key={`${line.lineId}-${message.state}-${index}`}>
                  {message.message}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            {onQuantityChange ? (
              <QuantitySelector
                isLoading={Boolean(mutationLabel)}
                max={line.lineType === 'bundle' ? 1 : 5}
                onChange={(quantity) => onQuantityChange(line.lineId, quantity)}
                value={line.quantity}
              />
            ) : (
              <p className="text-sm">Số lượng: {line.quantity}</p>
            )}
            <p className="text-sm font-medium">
              Thành tiền: <Price amount={line.lineTotal} />
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {onRemove ? (
              <button
                className="underline-offset-4 hover:underline"
                onClick={() => onRemove(line.lineId)}
                type="button"
              >
                Xóa
              </button>
            ) : null}
            {onMoveToWishlist ? (
              <button
                className="underline-offset-4 hover:underline"
                onClick={() => onMoveToWishlist(line.lineId)}
                type="button"
              >
                Chuyển sang yêu thích
              </button>
            ) : null}
            <span className="text-text-subtle">SKU: {line.skuId}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
