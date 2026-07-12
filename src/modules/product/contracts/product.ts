import type { ApiError } from '@/lib/api/error';
import type {
  CatalogImage,
  ProductBadgeInfo,
  ProductSummary,
} from '@/modules/catalog/contracts/catalog';

export const productStatuses = [
  'published',
  'draft',
  'archived',
  'discontinued',
] as const;
export type ProductStatus = (typeof productStatuses)[number];

export type ProductColor = {
  colorId: string;
  label: string;
  swatchHex: string;
};

export type ProductSize = {
  label: string;
  sizeId: string;
};

export type ProductSection = {
  content: string[];
  id: string;
  title: string;
};

export type ProductSku = {
  available: boolean;
  code: string;
  colorId: string;
  compareAtPrice?: number;
  images: CatalogImage[];
  price: number;
  sizeId: string;
  skuId: string;
  stockLabel: string;
  stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock';
};

export type ProductBundleComponent = {
  componentId: string;
  description: string;
  fixedColor: ProductColor;
  image: CatalogImage;
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  sizeOptions: Array<{
    available: boolean;
    label: string;
    sizeId: string;
    skuId: string;
    stockLabel: string;
  }>;
  title: string;
};

export type ProductBundle = {
  bundleId: string;
  compareAtPrice?: number;
  components: ProductBundleComponent[];
  price: number;
  selectionNote: string;
  title: string;
};

export type ProductDetail = {
  badges: ProductBadgeInfo[];
  bundle?: ProductBundle;
  category: { href: string; label: string };
  colorLabel: string;
  colors: ProductColor[];
  defaultColorId: string;
  defaultGallery: CatalogImage[];
  description: string;
  fitNote: string;
  genderLabel: string;
  id: string;
  kind: 'bundle' | 'simple';
  materialLabel: string;
  materials: string[];
  name: string;
  recommendations: ProductSummary[];
  sections: ProductSection[];
  sizeGuide: string[];
  sizes: ProductSize[];
  skuLabel?: string;
  skus: ProductSku[];
  slug: string;
  status: ProductStatus;
  stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockNote: string;
  sustainabilityNote: string;
};

export type ProductSearchState = {
  color?: string;
  size?: string;
};

export type ProductSelectionState = {
  hasQuery: boolean;
  issues: {
    invalidColor: boolean;
    invalidSize: boolean;
  };
  selectedColor: ProductColor;
  selectedSizeId?: string;
  selectedSku?: ProductSku;
  sizeOptions: Array<{
    available: boolean;
    label: string;
    sizeId: string;
    skuId?: string;
    stockLabel?: string;
  }>;
};

export type ProductPageData = {
  product: ProductDetail;
  recommendationsError: ApiError | null;
  selection: ProductSelectionState;
};

export type ProductDetailProvider = (
  slug: string,
  options: { signal?: AbortSignal },
) => Promise<
  { data: ProductDetail | null; error: null } | { data: null; error: ApiError }
>;
