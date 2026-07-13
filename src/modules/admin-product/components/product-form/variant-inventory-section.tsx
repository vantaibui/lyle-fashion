import { Badge } from '@/components/ui/badge';
import { FormMessage } from '@/components/ui/form-field';
import { formatVnd } from '@/lib/utils/format';
import { findVariantValidationIssues } from '@/modules/admin-product/utils/variant-validation';
import type { AdminProductVariant } from '@/modules/admin-product/contracts/admin-product-detail';

export function VariantInventorySection({
  disabled,
  variants,
}: {
  disabled: boolean;
  variants: AdminProductVariant[];
}) {
  const issues = findVariantValidationIssues(variants);

  return (
    <fieldset disabled={disabled}>
      <legend className="sr-only">Biến thể và tồn kho</legend>
      {issues.length > 0 && (
        <div className="mb-4 grid gap-1">
          {issues.map((issue, index) => (
            <FormMessage
              key={`${issue.variantId}-${index}`}
              role="alert"
              tone="error"
            >
              {issue.message}
            </FormMessage>
          ))}
        </div>
      )}
      <div className="border-border-subtle overflow-x-auto rounded-xs border">
        <table className="w-full min-w-5xl border-collapse text-sm">
          <caption className="sr-only">Danh sách biến thể sản phẩm</caption>
          <thead>
            <tr className="border-border-subtle bg-surface-muted border-b text-left">
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Màu
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Kích thước
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Mã SKU
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Giá
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Tồn kho thực tế
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Đã giữ chỗ
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Tồn kho tối thiểu
              </th>
              <th className="px-3 py-2.5 font-semibold" scope="col">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-border-subtle divide-y">
            {variants.map((variant) => {
              const available = variant.stockOnHand - variant.reserved;
              return (
                <tr key={variant.id}>
                  <th className="px-3 py-2.5 font-normal" scope="row">
                    {variant.colorLabel}
                  </th>
                  <td className="px-3 py-2.5">{variant.sizeLabel}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    {variant.skuCode}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {formatVnd(variant.price)}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {variant.stockOnHand}
                    {available <= variant.safetyStock && (
                      <span className="text-danger ml-2 text-xs font-medium">
                        Còn {available} khả dụng
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {variant.reserved}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {variant.safetyStock}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge
                      tone={variant.status === 'active' ? 'success' : 'neutral'}
                    >
                      {variant.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}
