import 'server-only';

import type {
  AdminProductListItem,
  AdminProductListProvider,
} from '@/modules/admin-product/contracts/admin-product';

/** Development fixture only. Replace with the approved PIM/commerce backend. */
const mockProducts: AdminProductListItem[] = [
  {
    categoryName: 'Áo sơ mi',
    collectionNames: ['Bộ sưu tập Linen'],
    id: 'product-linen-shirt',
    inventory: { skuCount: 6, totalAvailable: 42, totalOnHand: 48 },
    materialNames: ['Linen'],
    name: 'Áo sơ mi Linen',
    slug: 'ao-so-mi-linen',
    status: 'published',
    updatedAt: '2026-07-08T03:15:00.000Z',
  },
  {
    categoryName: 'Áo thun',
    collectionNames: ['Bộ sưu tập Lyocell'],
    id: 'product-lyocell-tee',
    inventory: { skuCount: 8, totalAvailable: 0, totalOnHand: 0 },
    materialNames: ['Lyocell'],
    name: 'Áo thun Lyocell',
    slug: 'ao-thun-lyocell',
    status: 'published',
    updatedAt: '2026-07-05T09:40:00.000Z',
  },
  {
    categoryName: 'Bộ thường ngày',
    collectionNames: ['Bộ sưu tập Eco'],
    id: 'product-casual-set',
    inventory: { skuCount: 4, totalAvailable: 12, totalOnHand: 12 },
    materialNames: ['Linen', 'Lyocell'],
    name: 'Bộ thường ngày Eco',
    slug: 'bo-thuong-ngay-eco',
    status: 'draft',
    updatedAt: '2026-07-10T14:05:00.000Z',
  },
  {
    categoryName: 'Quần dài',
    collectionNames: [],
    id: 'product-linen-pants',
    inventory: { skuCount: 5, totalAvailable: 3, totalOnHand: 3 },
    materialNames: ['Linen'],
    name: 'Quần dài Linen',
    slug: 'quan-dai-linen',
    status: 'archived',
    updatedAt: '2026-06-20T11:00:00.000Z',
  },
];

export const mockAdminProductAdapter: AdminProductListProvider = async (
  query,
) => {
  let filtered = mockProducts;

  if (query.q) {
    const needle = query.q.toLowerCase();
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(needle),
    );
  }
  if (query.status)
    filtered = filtered.filter((product) => product.status === query.status);
  if (query.category)
    filtered = filtered.filter(
      (product) => product.categoryName === query.category,
    );
  if (query.collection)
    filtered = filtered.filter((product) =>
      product.collectionNames.includes(query.collection!),
    );
  if (query.material)
    filtered = filtered.filter((product) =>
      product.materialNames.includes(query.material!),
    );

  const sorted = [...filtered].sort((a, b) => {
    if (query.sort === 'name-asc') return a.name.localeCompare(b.name, 'vi');
    if (query.sort === 'name-desc') return b.name.localeCompare(a.name, 'vi');
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });

  const page = query.page ?? 1;
  const start = (page - 1) * query.pageSize;
  const items = sorted.slice(start, start + query.pageSize);

  return {
    data: {
      items,
      pagination: {
        page,
        pageSize: query.pageSize,
        total: sorted.length,
        totalPages: Math.max(1, Math.ceil(sorted.length / query.pageSize)),
      },
    },
    error: null,
  };
};
