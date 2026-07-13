import type { ApiError } from '@/lib/api/error';
import type { PaginatedData } from '@/lib/api/pagination';
import type {
  AdminProductSearchState,
  adminProductStatusValues,
} from '@/modules/admin-product/schemas/admin-product-search-params';

export type AdminProductStatus = (typeof adminProductStatusValues)[number];

export type AdminProductInventorySummary = {
  skuCount: number;
  totalAvailable: number;
  totalOnHand: number;
};

/** List-row projection. Never authoritative for cart/checkout pricing. */
export type AdminProductListItem = {
  categoryName: string;
  collectionNames: string[];
  id: string;
  inventory: AdminProductInventorySummary;
  materialNames: string[];
  name: string;
  slug: string;
  status: AdminProductStatus;
  updatedAt: string;
};

export type AdminProductQuery = AdminProductSearchState & {
  pageSize: number;
};

export type AdminProductListResult = PaginatedData<AdminProductListItem>;

export type AdminProductListProvider = (
  query: AdminProductQuery,
  options: { signal?: AbortSignal },
) => Promise<
  | { data: AdminProductListResult; error: null }
  | { data: null; error: ApiError }
>;

export const adminProductActionKeys = [
  'view',
  'edit',
  'duplicate',
  'publish',
  'unpublish',
  'archive',
  'restore',
] as const;

export type AdminProductActionKey = (typeof adminProductActionKeys)[number];
