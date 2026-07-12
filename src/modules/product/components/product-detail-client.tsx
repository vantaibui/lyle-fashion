'use client';

import { startTransition, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ProductColorSelector } from '@/components/commerce/product-color-selector';
import { ProductPrice } from '@/components/commerce/product-price';
import { ProductQuantity } from '@/components/commerce/product-quantity';
import { ProductSizeSelector } from '@/components/commerce/product-size-selector';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { Link } from '@/components/ui/link';
import { ProductBadge } from '@/components/ui/product-badge';
import { Toast } from '@/components/ui/toast';
import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';
import { dispatchCartUpdated } from '@/modules/cart/api/cart-client';
import { setWishlistProduct } from '@/modules/wishlist/api/wishlist-client';
import { createCartLineIntent } from '@/modules/product/api/product-cart-client';
import type {
  ProductBundleComponent,
  ProductDetail,
  ProductSelectionState,
  ProductSku,
} from '@/modules/product/contracts/product';
import { ProductGallery } from '@/modules/product/components/product-gallery';

function resolveSku(
  product: ProductDetail,
  colorId: string,
  sizeId?: string,
): ProductSku | undefined {
  if (!sizeId) return undefined;
  return product.skus.find(
    (sku) => sku.colorId === colorId && sku.sizeId === sizeId,
  );
}

function resolveSizeOptions(product: ProductDetail, colorId: string) {
  return product.sizes.map((size) => {
    const sku = resolveSku(product, colorId, size.sizeId);
    return {
      disabled: !sku?.available,
      label: size.label,
      value: size.sizeId,
    };
  });
}

export function ProductDetailClient({
  product,
  selection,
}: {
  product: ProductDetail;
  selection: ProductSelectionState;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [componentErrors, setComponentErrors] = useState<
    Record<string, string>
  >({});
  const [isPending, setIsPending] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlistPending, setIsWishlistPending] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [requestError, setRequestError] = useState<string>();
  const [selectedBundleSizes, setSelectedBundleSizes] = useState<
    Record<string, string>
  >({});
  const [selectedColorId, setSelectedColorId] = useState(
    selection.selectedColor.colorId,
  );
  const [selectedSizeId, setSelectedSizeId] = useState(
    selection.selectedSizeId,
  );
  const [toast, setToast] = useState<
    | { description?: string; title: string; tone: 'error' | 'success' }
    | undefined
  >();

  const selectedColor =
    product.colors.find((color) => color.colorId === selectedColorId) ??
    selection.selectedColor;
  const selectedSku = resolveSku(
    product,
    selectedColor.colorId,
    selectedSizeId,
  );
  const sizeOptions = resolveSizeOptions(product, selectedColor.colorId);
  const galleryImages =
    selectedSku?.images ??
    product.skus.find((sku) => sku.colorId === selectedColor.colorId)?.images ??
    product.defaultGallery;
  const activePrice =
    product.bundle?.price ?? selectedSku?.price ?? product.skus[0]?.price ?? 0;
  const activeCompareAt =
    product.bundle?.compareAtPrice ?? selectedSku?.compareAtPrice;
  const isDiscontinued = product.status === 'discontinued';
  const canPurchaseSimple =
    product.kind === 'simple' &&
    Boolean(selectedSku?.available) &&
    !isDiscontinued;

  useEffect(() => {
    noStorefrontAnalytics({
      name: product.kind === 'bundle' ? 'view_bundle' : 'view_item',
      properties: {
        productId: product.id,
        slug: product.slug,
      },
    });
  }, [product.id, product.kind, product.slug]);

  function syncVariantUrl(colorId: string, sizeId?: string) {
    const params = new URLSearchParams();
    if (colorId) params.set('color', colorId);
    if (sizeId) params.set('size', sizeId);
    const href =
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  async function handleWishlistToggle() {
    if (isWishlistPending) return;
    setIsWishlistPending(true);
    const next = !isFavorite;
    const response = await setWishlistProduct(product.id, next);
    setIsWishlistPending(false);

    if (response.error) {
      setToast({
        description:
          'Danh sách yêu thích sẽ hoạt động đầy đủ khi có backend xác thực.',
        title: 'Chưa thể cập nhật yêu thích',
        tone: 'error',
      });
      return;
    }

    setIsFavorite(next);
    noStorefrontAnalytics({
      name: 'add_to_wishlist',
      properties: { productId: product.id, selected: next ? 'true' : 'false' },
    });
  }

  async function submitSimple(mode: 'cart' | 'checkout') {
    if (!selectedSku) {
      setRequestError('Chọn kích thước trước khi tiếp tục.');
      return;
    }
    if (!selectedSku.available || isDiscontinued) {
      setRequestError(product.stockNote);
      return;
    }

    setIsPending(true);
    setRequestError(undefined);
    const response = await createCartLineIntent({
      productId: product.id,
      quantity,
      skuId: selectedSku.skuId,
    });
    setIsPending(false);

    if (response.error) {
      setRequestError(
        response.error.code === 'INVENTORY_CONFLICT'
          ? 'SKU vừa hết hàng. Hãy kiểm tra lại kích thước hoặc màu đang chọn.'
          : response.error.code === 'PRICING_CONFLICT'
            ? 'Giá đã thay đổi. Hãy xác nhận lại trước khi tiếp tục.'
            : 'Chưa thể xử lý yêu cầu này. Vui lòng thử lại.',
      );
      return;
    }

    dispatchCartUpdated({
      openDrawer: mode === 'cart',
      source: 'pdp',
    });

    noStorefrontAnalytics({
      name: mode === 'checkout' ? 'begin_checkout' : 'add_to_cart',
      properties: {
        productId: product.id,
        quantity,
        skuId: selectedSku.skuId,
      },
    });

    setToast({
      description:
        mode === 'checkout'
          ? 'Đã xác thực lựa chọn sản phẩm. Bạn đang được chuyển sang bước kế tiếp.'
          : 'Lựa chọn của bạn đã qua lớp xác thực server foundation.',
      title:
        mode === 'checkout'
          ? 'Đang chuyển đến thanh toán'
          : 'Đã thêm vào giỏ minh hoạ',
      tone: 'success',
    });

    if (mode === 'checkout') {
      router.push('/checkout');
    }
  }

  async function submitBundle(mode: 'cart' | 'checkout') {
    if (!product.bundle) return;

    const nextErrors: Record<string, string> = {};
    const components = product.bundle.components.flatMap((component) => {
      const sizeId = selectedBundleSizes[component.componentId];
      const size = component.sizeOptions.find((item) => item.sizeId === sizeId);

      if (!sizeId || !size) {
        nextErrors[component.componentId] =
          'Chọn kích thước cho thành phần này.';
        return [];
      }
      if (!size.available) {
        nextErrors[component.componentId] =
          'Kích thước này hiện không còn hàng.';
        return [];
      }

      return [
        {
          componentId: component.componentId,
          productId: component.productId,
          sizeId,
          skuId: size.skuId,
        },
      ];
    });

    setComponentErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setRequestError('Kiểm tra lại kích thước của từng thành phần trong set.');
      return;
    }

    setIsPending(true);
    setRequestError(undefined);
    const response = await createCartLineIntent({
      bundleId: product.bundle.bundleId,
      components,
      lineType: 'bundle',
      productId: product.id,
      quantity: 1,
    });
    setIsPending(false);

    if (response.error) {
      setRequestError(
        response.error.code === 'INVENTORY_CONFLICT'
          ? 'Một thành phần trong set vừa thay đổi tồn kho. Hãy chọn lại.'
          : 'Set này chưa thể thêm vào giỏ lúc này. Vui lòng thử lại.',
      );
      return;
    }

    dispatchCartUpdated({
      openDrawer: mode === 'cart',
      source: 'pdp',
    });

    noStorefrontAnalytics({
      name: mode === 'checkout' ? 'begin_checkout' : 'add_to_cart',
      properties: {
        bundleId: product.bundle.bundleId,
        productId: product.id,
      },
    });

    setToast({
      description:
        mode === 'checkout'
          ? 'Set đã qua lớp xác thực thành phần và đang chuyển sang thanh toán.'
          : 'Set được gửi theo một nhóm bundle có kiểm tra từng SKU thành phần.',
      title:
        mode === 'checkout'
          ? 'Đang chuyển đến thanh toán'
          : 'Đã thêm set minh hoạ vào giỏ',
      tone: 'success',
    });

    if (mode === 'checkout') {
      router.push('/checkout');
    }
  }

  function renderBundleComponent(component: ProductBundleComponent) {
    return (
      <div
        className="border-border-subtle grid gap-4 border p-4"
        key={component.componentId}
      >
        <div className="grid gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
          <div>
            <ProductGallery
              images={[component.image]}
              productName={component.productName}
            />
          </div>
          <div className="grid gap-3">
            <div>
              <p className="text-text-subtle text-xs tracking-[0.18em] uppercase">
                {component.title}
              </p>
              <h3 className="mt-1 text-lg font-medium">
                {component.productName}
              </h3>
              <p className="text-text-muted mt-2 text-sm">
                {component.description}
              </p>
            </div>
            <p className="text-text-muted text-sm">
              Màu cố định: {component.fixedColor.label}
            </p>
            <ProductSizeSelector
              errorMessage={componentErrors[component.componentId]}
              label="Chọn kích thước"
              name={component.componentId}
              onChange={(value) => {
                setComponentErrors((current) => {
                  const next = { ...current };
                  delete next[component.componentId];
                  return next;
                });
                setSelectedBundleSizes((current) => ({
                  ...current,
                  [component.componentId]: value,
                }));
                noStorefrontAnalytics({
                  name: 'select_bundle_component',
                  properties: {
                    bundleId: product.bundle?.bundleId ?? '',
                    componentId: component.componentId,
                    sizeId: value,
                  },
                });
              }}
              options={component.sizeOptions.map((size) => ({
                disabled: !size.available,
                label: size.label,
                value: size.sizeId,
              }))}
              value={selectedBundleSizes[component.componentId]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.95fr)] lg:items-start xl:gap-12">
        <ProductGallery images={galleryImages} productName={product.name} />

        <div className="grid gap-6 lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <ProductBadge key={badge.id}>{badge.label}</ProductBadge>
                ))}
                {product.kind === 'bundle' && (
                  <ProductBadge emphasis="strong">Set cố định</ProductBadge>
                )}
              </div>
              <h1 className="font-display text-4xl leading-tight text-pretty md:text-5xl">
                {product.name}
              </h1>
              <p className="text-text-muted mt-3 text-lg">
                {product.description}
              </p>
            </div>
            <IconButton
              isLoading={isWishlistPending}
              label={
                isFavorite
                  ? `Bỏ ${product.name} khỏi yêu thích`
                  : `Thêm ${product.name} vào yêu thích`
              }
              onClick={() => void handleWishlistToggle()}
            >
              <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
            </IconButton>
          </div>

          <div className="border-border-subtle grid gap-3 border-y py-5">
            <ProductPrice
              amount={activePrice}
              compareAtAmount={activeCompareAt}
            />
            <div className="text-text-muted grid gap-1 text-sm">
              <p>
                {product.kind === 'bundle'
                  ? 'Giá bundle do backend xác thực.'
                  : product.stockNote}
              </p>
              {product.kind === 'simple' && selectedSku && (
                <p>
                  {product.skuLabel}:{' '}
                  <span className="text-text font-medium">
                    {selectedSku.code}
                  </span>
                </p>
              )}
            </div>
          </div>

          {(selection.issues.invalidColor || selection.issues.invalidSize) && (
            <Toast title="Tham số biến thể không hợp lệ" tone="error">
              Liên kết biến thể được giữ ở canonical sản phẩm. Hãy chọn lại màu
              hoặc kích thước phù hợp.
            </Toast>
          )}

          {product.kind === 'simple' ? (
            <>
              <ProductColorSelector
                label={product.colorLabel}
                onChange={(value) => {
                  setSelectedColorId(value);
                  const nextSku = resolveSku(product, value, selectedSizeId);
                  const nextSizeId = nextSku ? selectedSizeId : undefined;
                  setSelectedSizeId(nextSizeId);
                  setRequestError(undefined);
                  syncVariantUrl(value, nextSizeId);
                  noStorefrontAnalytics({
                    name: 'select_item_variant',
                    properties: { colorId: value, productId: product.id },
                  });
                }}
                options={product.colors.map((color) => ({
                  color: color.swatchHex,
                  label: color.label,
                  value: color.colorId,
                }))}
                value={selectedColorId}
              />

              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Kích thước</span>
                  <button
                    className="text-text-muted text-sm underline underline-offset-4"
                    onClick={() => setIsSizeGuideOpen(true)}
                    type="button"
                  >
                    Xem bảng kích thước
                  </button>
                </div>
                <ProductSizeSelector
                  errorMessage={requestError}
                  label="Kích thước"
                  name="product-size"
                  onChange={(value) => {
                    setSelectedSizeId(value);
                    setRequestError(undefined);
                    syncVariantUrl(selectedColorId, value);
                    noStorefrontAnalytics({
                      name: 'select_item_variant',
                      properties: {
                        colorId: selectedColorId,
                        productId: product.id,
                        sizeId: value,
                      },
                    });
                  }}
                  options={sizeOptions}
                  value={selectedSizeId}
                />
                {selectedSku && (
                  <p className="text-text-muted text-sm">
                    {selectedSku.stockLabel}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
                <div className="grid gap-2">
                  <span className="text-sm font-medium">Số lượng</span>
                  <ProductQuantity
                    disabled={isPending || !canPurchaseSimple}
                    max={5}
                    onChange={setQuantity}
                    value={quantity}
                  />
                </div>
                <div className="grid gap-3">
                  <Button
                    disabled={!canPurchaseSimple}
                    isLoading={isPending}
                    onClick={() => void submitSimple('cart')}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    disabled={!canPurchaseSimple}
                    onClick={() => void submitSimple('checkout')}
                    variant="secondary"
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <p className="text-sm font-medium">Chọn set phù hợp</p>
                  <p className="text-text-muted text-sm">
                    {product.bundle?.selectionNote}
                  </p>
                </div>
                {product.bundle?.components.map(renderBundleComponent)}
              </div>
              <div className="grid gap-3">
                <Button
                  isLoading={isPending}
                  onClick={() => void submitBundle('cart')}
                >
                  Thêm set vào giỏ
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => void submitBundle('checkout')}
                  variant="secondary"
                >
                  Mua set ngay
                </Button>
              </div>
            </>
          )}

          {requestError && !selection.issues.invalidSize && (
            <Toast title="Chưa thể tiếp tục" tone="error">
              {requestError}
            </Toast>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-border-subtle grid gap-2 border p-4">
              <p className="text-sm font-medium">Giao nhận</p>
              <p className="text-text-muted text-sm">
                Địa chỉ, vận chuyển và COD được xác thực lại ở checkout khi có
                dữ liệu thực.
              </p>
              <Link href="/shipping-policy">Xem chính sách giao hàng</Link>
            </div>
            <div className="border-border-subtle grid gap-2 border p-4">
              <p className="text-sm font-medium">Cửa hàng</p>
              <p className="text-text-muted text-sm">
                Foundation cho cửa hàng vật lý và nhận tư vấn đã sẵn sàng ở mức
                route.
              </p>
              <Link href="/stores">Xem cửa hàng</Link>
            </div>
          </div>

          <div className="border-border-subtle border-t">
            {product.sections.map((section) => (
              <Accordion key={section.id} title={section.title}>
                <div className="grid gap-3 py-1">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="border-border bg-background/95 pointer-events-auto mx-4 mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm">
          <div className="min-w-0">
            <p className="font-medium">
              {activePrice.toLocaleString('vi-VN')} ₫
            </p>
            <p className="text-text-muted text-sm">
              {product.kind === 'bundle'
                ? 'Chọn cỡ cho từng thành phần'
                : (selectedSku?.stockLabel ?? 'Chọn màu và kích thước')}
            </p>
          </div>
          <Button
            disabled={
              product.kind === 'bundle'
                ? isPending
                : !canPurchaseSimple || isPending
            }
            onClick={() =>
              void (product.kind === 'bundle'
                ? submitBundle('cart')
                : submitSimple('cart'))
            }
            size="sm"
          >
            {product.kind === 'bundle' ? 'Thêm set' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </div>

      <Dialog
        description="Bảng dưới là dữ liệu minh hoạ cho foundation giao diện; hệ thống sản phẩm thật sẽ thay thế bằng bảng đã duyệt."
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        title="Bảng kích thước"
      >
        <div className="grid gap-3">
          {product.sizeGuide.map((entry) => (
            <p className="text-text-muted" key={entry}>
              {entry}
            </p>
          ))}
        </div>
      </Dialog>

      {toast && (
        <div className="fixed top-20 right-4 z-50">
          <Toast title={toast.title} tone={toast.tone}>
            {toast.description}
          </Toast>
        </div>
      )}
    </>
  );
}
