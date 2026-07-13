import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminProductSeo } from '@/modules/admin-product/contracts/admin-product-detail';

export function SeoSection({
  disabled,
  seo,
}: {
  disabled: boolean;
  seo: AdminProductSeo;
}) {
  return (
    <fieldset className="grid gap-5" disabled={disabled}>
      <legend className="sr-only">Thông tin SEO</legend>
      <FormField htmlFor="product-meta-title" label="Tiêu đề SEO" required>
        <Input
          defaultValue={seo.metaTitle}
          id="product-meta-title"
          maxLength={70}
          name="metaTitle"
          required
        />
      </FormField>
      <FormField htmlFor="product-meta-description" label="Mô tả SEO" required>
        <Textarea
          defaultValue={seo.metaDescription}
          id="product-meta-description"
          maxLength={160}
          name="metaDescription"
          required
          rows={3}
        />
      </FormField>
    </fieldset>
  );
}
