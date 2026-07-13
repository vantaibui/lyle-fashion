import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link';
import type { AdminProductListItem } from '@/modules/admin-product/contracts/admin-product';
import {
  productStatusLabel,
  productStatusTone,
} from '@/modules/admin-product/utils/product-status-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function AdminProductTable({
  canUpdate,
  items,
}: {
  canUpdate: boolean;
  items: AdminProductListItem[];
}) {
  return (
    <div className="border-border-subtle overflow-x-auto rounded-xs border">
      <table className="w-full min-w-4xl border-collapse text-sm">
        <caption className="sr-only">Danh sách sản phẩm</caption>
        <thead>
          <tr className="border-border-subtle bg-surface-muted border-b text-left">
            <th className="px-4 py-3 font-semibold" scope="col">
              Sản phẩm
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Danh mục
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Trạng thái
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Tồn kho khả dụng
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Cập nhật
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-border-subtle divide-y">
          {items.map((product) => (
            <tr key={product.id}>
              <th className="px-4 py-3 font-medium" scope="row">
                {product.name}
              </th>
              <td className="px-4 py-3">{product.categoryName}</td>
              <td className="px-4 py-3">
                <Badge tone={productStatusTone(product.status)}>
                  {productStatusLabel(product.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {product.inventory.totalAvailable === 0 ? (
                  <span className="text-danger font-medium">Hết hàng</span>
                ) : (
                  `${product.inventory.totalAvailable} / ${product.inventory.skuCount} SKU`
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatAdminTimestamp(product.updatedAt)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link href={`/admin/products/${product.id}`} variant="subtle">
                  {canUpdate ? 'Chỉnh sửa' : 'Xem'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
