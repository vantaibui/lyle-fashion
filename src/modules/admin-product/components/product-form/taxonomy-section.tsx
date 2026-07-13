import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { AdminProductTaxonomy } from '@/modules/admin-product/contracts/admin-product-detail';

/**
 * Category/collection/material sources are not yet approved
 * (docs/ECOMMERCE-FUNCTIONAL-SCOPE.md open decisions), so this section
 * accepts identifiers directly rather than a fabricated picker backed by
 * fake taxonomy data. Replace with an approved combobox once a taxonomy
 * provider exists.
 */
export function TaxonomySection({
  disabled,
  taxonomy,
}: {
  disabled: boolean;
  taxonomy: AdminProductTaxonomy;
}) {
  return (
    <fieldset className="grid gap-5" disabled={disabled}>
      <legend className="sr-only">Danh mục và bộ sưu tập</legend>
      <FormField htmlFor="product-category" label="Danh mục" required>
        <Input
          defaultValue={taxonomy.categoryId}
          id="product-category"
          name="categoryId"
          required
        />
      </FormField>
      <FormField
        description="Nhập nhiều mã, cách nhau bởi dấu phẩy."
        htmlFor="product-collections"
        label="Bộ sưu tập"
      >
        <Input
          defaultValue={taxonomy.collectionIds.join(', ')}
          id="product-collections"
          name="collectionIds"
        />
      </FormField>
      <FormField
        description="Nhập nhiều mã, cách nhau bởi dấu phẩy."
        htmlFor="product-materials"
        label="Chất liệu"
        required
      >
        <Input
          defaultValue={taxonomy.materialIds.join(', ')}
          id="product-materials"
          name="materialIds"
          required
        />
      </FormField>
    </fieldset>
  );
}
