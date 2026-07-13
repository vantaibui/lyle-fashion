'use client';

import { Tabs } from '@/components/ui/tabs';
import { BasicInfoSection } from '@/modules/admin-product/components/product-form/basic-info-section';
import { PublishingSection } from '@/modules/admin-product/components/product-form/publishing-section';
import { SeoSection } from '@/modules/admin-product/components/product-form/seo-section';
import { TaxonomySection } from '@/modules/admin-product/components/product-form/taxonomy-section';
import { VariantInventorySection } from '@/modules/admin-product/components/product-form/variant-inventory-section';
import type { AdminProductDetail } from '@/modules/admin-product/contracts/admin-product-detail';

/**
 * Composition root only. Each tab renders a domain-scoped section
 * component; this file owns no field logic itself, per the requirement to
 * split the product form by domain responsibility rather than building one
 * oversized component. Save/publish server actions are wired once the
 * backend contract for product mutation is approved.
 */
export function AdminProductForm({
  canUpdate,
  product,
}: {
  canUpdate: boolean;
  product: AdminProductDetail;
}) {
  return (
    <Tabs
      label="Phần chỉnh sửa sản phẩm"
      tabs={[
        {
          content: (
            <BasicInfoSection
              basicInfo={product.basicInfo}
              disabled={!canUpdate}
            />
          ),
          label: 'Thông tin cơ bản',
          value: 'basic-info',
        },
        {
          content: (
            <TaxonomySection
              disabled={!canUpdate}
              taxonomy={product.taxonomy}
            />
          ),
          label: 'Danh mục',
          value: 'taxonomy',
        },
        {
          content: (
            <VariantInventorySection
              disabled={!canUpdate}
              variants={product.variants}
            />
          ),
          label: 'Biến thể & tồn kho',
          value: 'variants',
        },
        {
          content: <SeoSection disabled={!canUpdate} seo={product.seo} />,
          label: 'SEO',
          value: 'seo',
        },
        {
          content: (
            <PublishingSection
              canPublish={canUpdate}
              status={product.status}
              updatedAt={product.updatedAt}
            />
          ),
          label: 'Xuất bản',
          value: 'publishing',
        },
      ]}
    />
  );
}
