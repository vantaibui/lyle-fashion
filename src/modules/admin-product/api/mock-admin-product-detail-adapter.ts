import 'server-only';

import type {
  AdminProductDetail,
  AdminProductDetailProvider,
} from '@/modules/admin-product/contracts/admin-product-detail';

/** Development fixture only. Replace with the approved PIM/commerce backend. */
const mockProductDetails: Record<string, AdminProductDetail> = {
  'product-linen-shirt': {
    basicInfo: {
      description: 'Áo sơ mi Linen tối giản, thoáng mát cho khí hậu nhiệt đới.',
      gender: 'men',
      name: 'Áo sơ mi Linen',
      slug: 'ao-so-mi-linen',
    },
    id: 'product-linen-shirt',
    seo: {
      metaDescription: 'Áo sơ mi Linen cao cấp dành cho nam giới Việt Nam.',
      metaTitle: 'Áo sơ mi Linen | LYLE Fashion',
    },
    status: 'published',
    taxonomy: {
      categoryId: 'shirts',
      collectionIds: ['linen-collection'],
      materialIds: ['linen'],
    },
    updatedAt: '2026-07-08T03:15:00.000Z',
    variants: [
      {
        colorId: 'natural',
        colorLabel: 'Tự nhiên',
        id: 'variant-natural-m',
        price: 399000,
        reserved: 2,
        safetyStock: 5,
        sizeId: 'm',
        sizeLabel: 'M',
        skuCode: 'LYLE-SHIRT-LINEN-NAT-M',
        status: 'active',
        stockOnHand: 20,
      },
      {
        colorId: 'natural',
        colorLabel: 'Tự nhiên',
        id: 'variant-natural-l',
        price: 399000,
        reserved: 0,
        safetyStock: 5,
        sizeId: 'l',
        sizeLabel: 'L',
        skuCode: 'LYLE-SHIRT-LINEN-NAT-L',
        status: 'active',
        stockOnHand: 22,
      },
    ],
    version: 3,
  },
};

export const mockAdminProductDetailAdapter: AdminProductDetailProvider = async (
  productId,
) => {
  return { data: mockProductDetails[productId] ?? null, error: null };
};
