import type { ApiError } from '@/lib/api/error';
import type { Pagination } from '@/lib/api/pagination';
import type { ProductSearchState } from '@/lib/validation/search-params';

export const catalogGenders = ['men', 'women', 'unisex'] as const;
export type CatalogGender = (typeof catalogGenders)[number];

export const stockLevels = ['in-stock', 'low-stock', 'out-of-stock'] as const;
export type StockLevel = (typeof stockLevels)[number];

export const productBadgeKinds = [
  'new',
  'best-seller',
  'limited',
  'sustainable',
  'exclusive',
] as const;
export type ProductBadgeKind = (typeof productBadgeKinds)[number];

export type ProductBadgeInfo = {
  id: string;
  kind: ProductBadgeKind;
  label: string;
};

export type CatalogImage = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export type ProductCardColorOption = {
  colorId: string;
  image: CatalogImage;
  label: string;
  swatchHex: string;
};

export type ProductCardSizeOption = {
  available: boolean;
  label: string;
  skuId: string;
  sizeId: string;
};

/** Summary shape rendered by a PLP product card. Never authoritative for cart/checkout. */
export type ProductSummary = {
  badges: ProductBadgeInfo[];
  categoryId: string;
  colors: ProductCardColorOption[];
  compareAtPrice?: number;
  discountPercentageAllowed?: boolean;
  gender: CatalogGender;
  id: string;
  /** Bundle products are completed on the PDP, not via simple card add-to-cart. */
  isBundle?: boolean;
  lowStockThreshold?: number;
  materialLabel?: string;
  name: string;
  price: number;
  primaryImage: CatalogImage;
  requiresSizeSelection: boolean;
  sizes: ProductCardSizeOption[];
  slug: string;
  stockLevel: StockLevel;
};

export type CatalogLandingContent = {
  breadcrumbLabel: string;
  campaignImage?: CatalogImage;
  description?: string;
  id: string;
  seoDescription: string;
  slug: string;
  title: string;
};

export const catalogFilterKeys = [
  'gender',
  'category',
  'collection',
  'material',
  'style',
  'color',
  'size',
  'availability',
  'priceTier',
  'promotion',
] as const;
export type CatalogFilterKey = (typeof catalogFilterKeys)[number];

export type CatalogFilterOption = {
  count?: number;
  disabled?: boolean;
  label: string;
  value: string;
};

export type CatalogFilterFacet = {
  key: CatalogFilterKey;
  label: string;
  options: CatalogFilterOption[];
};

export type CatalogSort = NonNullable<ProductSearchState['sort']>;

export type CatalogSortOption = {
  label: string;
  value: CatalogSort;
};

export type CatalogQuery = {
  availability?: string[];
  category?: string[];
  collection?: string[];
  color?: string[];
  gender?: CatalogGender[];
  material?: string[];
  page: number;
  pageSize: number;
  priceTier?: string[];
  promotion?: string[];
  q?: string;
  size?: string[];
  sort: CatalogSort;
  style?: string[];
};

export type CatalogResult = {
  facets: CatalogFilterFacet[];
  pagination: Pagination;
  products: ProductSummary[];
  sortOptions: CatalogSortOption[];
};

export type CatalogResultProvider = (
  query: CatalogQuery,
  options: { signal?: AbortSignal },
) => Promise<
  { data: CatalogResult; error: null } | { data: null; error: ApiError }
>;

export type CatalogLandingIdentifier =
  | { collectionSlug: string; gender?: undefined }
  | { collectionSlug?: undefined; gender: CatalogGender; shop?: undefined }
  | { collectionSlug?: undefined; gender?: undefined; shop: true };

/** Resolves durable gender/collection landing content. `data: null, error: null` means not found. */
export type CatalogLandingProvider = (
  identifier: CatalogLandingIdentifier,
  options: { signal?: AbortSignal },
) => Promise<
  | { data: CatalogLandingContent | null; error: null }
  | { data: null; error: ApiError }
>;
