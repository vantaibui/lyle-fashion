import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AdminProductBasicInfo } from '@/modules/admin-product/contracts/admin-product-detail';

export function BasicInfoSection({
  basicInfo,
  disabled,
}: {
  basicInfo: AdminProductBasicInfo;
  disabled: boolean;
}) {
  return (
    <fieldset className="grid gap-5" disabled={disabled}>
      <legend className="sr-only">Thông tin cơ bản</legend>
      <FormField htmlFor="product-name" label="Tên sản phẩm" required>
        <Input
          defaultValue={basicInfo.name}
          id="product-name"
          name="name"
          required
        />
      </FormField>
      <FormField
        description="Dùng trong đường dẫn URL. Chỉ chữ thường, số và dấu gạch ngang."
        htmlFor="product-slug"
        label="Slug"
        required
      >
        <Input
          defaultValue={basicInfo.slug}
          id="product-slug"
          name="slug"
          required
        />
      </FormField>
      <FormField htmlFor="product-gender" label="Đối tượng" required>
        <Select
          defaultValue={basicInfo.gender}
          id="product-gender"
          name="gender"
          required
        >
          <option value="men">Nam</option>
          <option value="women">Nữ</option>
          <option value="unisex">Unisex</option>
        </Select>
      </FormField>
      <FormField htmlFor="product-description" label="Mô tả" required>
        <Textarea
          defaultValue={basicInfo.description}
          id="product-description"
          name="description"
          required
          rows={6}
        />
      </FormField>
    </fieldset>
  );
}
