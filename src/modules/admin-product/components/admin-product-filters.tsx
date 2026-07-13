import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  adminProductSortValues,
  adminProductStatusValues,
} from '@/modules/admin-product/schemas/admin-product-search-params';
import type { AdminProductSearchState } from '@/modules/admin-product/schemas/admin-product-search-params';
import { productStatusLabel } from '@/modules/admin-product/utils/product-status-label';

const sortLabels: Record<(typeof adminProductSortValues)[number], string> = {
  'name-asc': 'Tên A–Z',
  'name-desc': 'Tên Z–A',
  'updated-desc': 'Cập nhật gần nhất',
};

export function AdminProductFilters({
  searchState,
}: {
  searchState: AdminProductSearchState;
}) {
  return (
    <form
      action="/admin/products"
      className="grid gap-4 md:grid-cols-4"
      method="get"
    >
      <FormField className="md:col-span-2" htmlFor="q" label="Tìm kiếm">
        <Input
          defaultValue={searchState.q ?? ''}
          id="q"
          name="q"
          placeholder="Tên sản phẩm…"
          type="search"
        />
      </FormField>
      <FormField htmlFor="status" label="Trạng thái">
        <Select
          defaultValue={searchState.status ?? ''}
          id="status"
          name="status"
        >
          <option value="">Tất cả</option>
          {adminProductStatusValues.map((status) => (
            <option key={status} value={status}>
              {productStatusLabel(status)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField htmlFor="sort" label="Sắp xếp">
        <Select
          defaultValue={searchState.sort ?? 'updated-desc'}
          id="sort"
          name="sort"
        >
          {adminProductSortValues.map((sort) => (
            <option key={sort} value={sort}>
              {sortLabels[sort]}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="md:col-span-4">
        <Button size="sm" type="submit" variant="secondary">
          Áp dụng bộ lọc
        </Button>
      </div>
    </form>
  );
}
