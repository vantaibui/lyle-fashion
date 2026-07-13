'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ProductBadgeGroup } from '@/components/commerce/product-badge-group';
import { ProductCardShell } from '@/components/commerce/product-card-shell';
import { ProductImage } from '@/components/commerce/product-image';
import { ProductPrice } from '@/components/commerce/product-price';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from '@/components/ui/color-swatch';
import { Dialog } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { ProductBadge } from '@/components/ui/product-badge';
import { SizeSelector } from '@/components/ui/size-selector';
import { Skeleton } from '@/components/ui/skeleton';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import { dispatchCartUpdated } from '@/modules/cart/api/cart-client';
import { quickAddToCart } from '@/modules/cart/api/quick-add-client';
import type { ProductSummary } from '@/modules/catalog/contracts/catalog';
import { calculateDiscountPercentage } from '@/modules/catalog/utils/discount';
import { setWishlistProduct } from '@/modules/wishlist/api/wishlist-client';

export function ProductCard({
  eager = false,
  product,
}: {
  eager?: boolean;
  product: ProductSummary;
}) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddError, setQuickAddError] = useState<string>();
  const [quickAddPending, setQuickAddPending] = useState(false);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(
    product.colors[0]?.colorId,
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>();
  const [wishlistPending, setWishlistPending] = useState(false);
  const selectedColor =
    product.colors.find((color) => color.colorId === selectedColorId) ??
    product.colors[0];
  const currentImage = selectedColor?.image ?? product.primaryImage;
  const discount = calculateDiscountPercentage(
    product.price,
    product.compareAtPrice,
    product.discountPercentageAllowed ?? false,
  );
  const isOutOfStock = product.stockLevel === 'out-of-stock';

  async function toggleFavorite() {
    if (wishlistPending) return;
    setWishlistPending(true);
    const next = !isFavorite;
    const response = await setWishlistProduct(product.id, next);
    setWishlistPending(false);
    if (!response.error) {
      setIsFavorite(next);
      noStorefrontAnalytics({
        name: 'add_to_wishlist',
        properties: { productId: product.id },
      });
    }
  }

  function openBuyNow() {
    if (isOutOfStock) return;
    setQuickAddError(undefined);
    setQuickAddSuccess(false);
    setIsQuickAddOpen(true);
  }

  async function submitQuickAdd() {
    const size = product.requiresSizeSelection
      ? product.sizes.find((item) => item.sizeId === selectedSizeId)
      : product.sizes.find((item) => item.available);
    if (product.requiresSizeSelection && !size) {
      setQuickAddError('Chọn kích thước trước khi thêm vào giỏ.');
      return;
    }
    if (!size?.available) {
      setQuickAddError('Kích thước này hiện không còn hàng.');
      return;
    }

    setQuickAddPending(true);
    setQuickAddError(undefined);
    // The cart store's authoritative SKU id is color-aware
    // (`${productId}-${colorId}-${sizeId}`). Build the same shape from the
    // selected colour so validation resolves against the product's SKU list.
    const colorId = selectedColor?.colorId;
    const skuId = colorId
      ? `${product.id}-${colorId}-${size.sizeId}`
      : size.skuId;
    const response = await quickAddToCart({
      productId: product.id,
      quantity: 1,
      skuId,
    });
    setQuickAddPending(false);
    if (response.error) {
      // Toast stays generic; log the real error for debugging.
      console.error('Quick add to cart failed', {
        productId: product.id,
        skuId,
        code: response.error.code,
        message: response.error.message,
      });
      setQuickAddError(
        response.error.code === 'INVENTORY_CONFLICT' ||
          response.error.code === 'PRICING_CONFLICT'
          ? 'Sản phẩm vừa thay đổi. Vui lòng kiểm tra lại lựa chọn.'
          : 'Chưa thể thêm vào giỏ. Vui lòng thử lại.',
      );
      return;
    }
    setQuickAddSuccess(true);
    dispatchCartUpdated({ source: 'plp' });
    noStorefrontAnalytics({
      name: 'begin_checkout',
      properties: { productId: product.id },
    });
    router.push('/checkout');
  }

  return (
    <>
      <ProductCardShell
        actions={
          <IconButton
            isLoading={wishlistPending}
            label={
              isFavorite
                ? `Bỏ ${product.name} khỏi yêu thích`
                : `Thêm ${product.name} vào yêu thích`
            }
            onClick={() => void toggleFavorite()}
          >
            <HeartIcon filled={isFavorite} />
          </IconButton>
        }
        badges={
          <ProductBadgeGroup>
            {product.badges.map((badge) => (
              <ProductBadge key={badge.id}>{badge.label}</ProductBadge>
            ))}
            {discount !== null && (
              <ProductBadge emphasis="strong">Giảm {discount}%</ProductBadge>
            )}
          </ProductBadgeGroup>
        }
        details={
          <div className="grid gap-3">
            <div className="min-w-0">
              <NextLink
                className="hover:text-action-muted font-medium text-pretty underline-offset-4 hover:underline"
                href={`/product/${product.slug}`}
                onClick={() =>
                  noStorefrontAnalytics({
                    name: 'select_item',
                    properties: { productId: product.id },
                  })
                }
              >
                {product.name}
              </NextLink>
              {product.materialLabel && (
                <p className="text-text-subtle mt-1 text-xs">
                  {product.materialLabel}
                </p>
              )}
              <ProductPrice
                amount={product.price}
                className="mt-2"
                compareAtAmount={product.compareAtPrice}
              />
            </div>
            {product.colors.length > 0 && (
              <div
                aria-label={`Màu của ${product.name}`}
                className="flex flex-wrap gap-1"
                role="group"
              >
                {product.colors.map((color) => (
                  <ColorSwatch
                    color={color.swatchHex}
                    key={color.colorId}
                    label={color.label}
                    onClick={() => {
                      setSelectedColorId(color.colorId);
                      setImageError(false);
                      setImageLoading(true);
                    }}
                    selected={color.colorId === selectedColorId}
                  />
                ))}
              </div>
            )}
            <p className="text-text-muted min-h-5 text-sm">
              {isOutOfStock
                ? 'Hết hàng'
                : product.stockLevel === 'low-stock'
                  ? 'Sắp hết hàng'
                  : ''}
            </p>
            {product.isBundle ? (
              // Bundles are completed on the PDP (grouped bundle intent), not via
              // the simple card add-to-cart path.
              <NextLink
                className="bg-action text-text-inverse hover:bg-action-hover inline-flex min-h-9 w-full items-center justify-center rounded-sm px-5 text-sm font-medium tracking-wide no-underline transition-colors"
                href={`/product/${product.slug}`}
              >
                Xem chi tiết
              </NextLink>
            ) : (
              <Button
                className="w-full"
                disabled={isOutOfStock}
                onClick={openBuyNow}
                size="sm"
                variant="primary"
              >
                {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
              </Button>
            )}
          </div>
        }
        media={
          <NextLink
            aria-label={`Xem ${product.name}`}
            href={`/product/${product.slug}`}
          >
            <ProductImage
              alt={currentImage.alt}
              loading={eager ? 'eager' : 'lazy'}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              src={currentImage.src}
            />
            {imageLoading && <Skeleton className="absolute inset-0" />}
            {imageError && (
              <span className="bg-surface-muted text-text-muted absolute inset-0 grid place-items-center p-6 text-center text-sm">
                Chưa thể tải hình ảnh
              </span>
            )}
          </NextLink>
        }
      />
      <Dialog
        description={product.name}
        isLoading={quickAddPending}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Mua ngay"
      >
        <SizeSelector
          disabled={quickAddPending || quickAddSuccess}
          errorMessage={quickAddError}
          label="Kích thước"
          name={`quick-add-${product.id}`}
          onChange={(value) => {
            setSelectedSizeId(value);
            setQuickAddError(undefined);
          }}
          options={product.sizes.map((size) => ({
            disabled: !size.available,
            label: size.label,
            value: size.sizeId,
          }))}
          value={selectedSizeId}
        />
        <Button
          className="mt-6 w-full"
          disabled={quickAddSuccess}
          isLoading={quickAddPending}
          onClick={() => void submitQuickAdd()}
        >
          {quickAddSuccess ? 'Đang chuyển đến thanh toán…' : 'Mua ngay'}
        </Button>
      </Dialog>
    </>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M20.5 9.2c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.5 2.9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
