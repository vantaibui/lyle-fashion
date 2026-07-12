import type {
  ProductColor,
  ProductDetail,
  ProductSearchState,
  ProductSelectionState,
} from '@/modules/product/contracts/product';

function uniqueSizesForColor(product: ProductDetail, colorId: string) {
  return product.sizes.map((size) => {
    const sku = product.skus.find(
      (candidate) =>
        candidate.colorId === colorId && candidate.sizeId === size.sizeId,
    );

    return {
      available: sku?.available ?? false,
      label: size.label,
      sizeId: size.sizeId,
      skuId: sku?.skuId,
      stockLabel: sku?.stockLabel,
    };
  });
}

function resolveColor(
  product: ProductDetail,
  requestedColorId?: string,
): {
  invalid: boolean;
  selectedColor: ProductColor;
} {
  const fallback =
    product.colors.find((color) => color.colorId === product.defaultColorId) ??
    product.colors[0];
  if (!fallback) {
    throw new Error(`Product ${product.id} must expose at least one color.`);
  }
  const selectedColor = requestedColorId
    ? (product.colors.find((color) => color.colorId === requestedColorId) ??
      fallback)
    : fallback;

  return {
    invalid:
      Boolean(requestedColorId) && selectedColor.colorId !== requestedColorId,
    selectedColor,
  };
}

export function resolveProductSelection(
  product: ProductDetail,
  searchState: ProductSearchState,
): ProductSelectionState {
  const { invalid: invalidColor, selectedColor } = resolveColor(
    product,
    searchState.color,
  );
  const sizeOptions = uniqueSizesForColor(product, selectedColor.colorId);
  const selectedSku = searchState.size
    ? product.skus.find(
        (sku) =>
          sku.colorId === selectedColor.colorId &&
          sku.sizeId === searchState.size,
      )
    : undefined;
  const selectedSizeId = selectedSku?.sizeId;

  return {
    hasQuery: Boolean(searchState.color || searchState.size),
    issues: {
      invalidColor,
      invalidSize: Boolean(searchState.size) && !selectedSku,
    },
    selectedColor,
    selectedSizeId,
    selectedSku,
    sizeOptions,
  };
}
