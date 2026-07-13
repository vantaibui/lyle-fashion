import type { ApiError } from '@/lib/api/error';
import type { AdminProductStatus } from '@/modules/admin-product/contracts/admin-product';

export type AdminProductBasicInfo = {
  description: string;
  gender: 'men' | 'women' | 'unisex';
  name: string;
  slug: string;
};

export type AdminProductTaxonomy = {
  categoryId: string;
  collectionIds: string[];
  materialIds: string[];
};

export type AdminProductSeo = {
  metaDescription: string;
  metaTitle: string;
};

export type AdminProductVariant = {
  barcode?: string;
  colorId: string;
  colorLabel: string;
  compareAtPrice?: number;
  id: string;
  price: number;
  reserved: number;
  safetyStock: number;
  sizeId: string;
  sizeLabel: string;
  skuCode: string;
  status: 'active' | 'inactive';
  stockOnHand: number;
};

/**
 * Full editable aggregate for the product create/edit workspace. Each
 * section (basic info, taxonomy, variants, SEO, publishing) reads only the
 * slice it owns; the server remains authoritative for validation on save.
 */
export type AdminProductDetail = {
  basicInfo: AdminProductBasicInfo;
  id: string;
  seo: AdminProductSeo;
  status: AdminProductStatus;
  taxonomy: AdminProductTaxonomy;
  updatedAt: string;
  variants: AdminProductVariant[];
  version: number;
};

export type AdminProductDetailProvider = (
  productId: string,
  options: { signal?: AbortSignal },
) => Promise<
  | { data: AdminProductDetail | null; error: null }
  | { data: null; error: ApiError }
>;
