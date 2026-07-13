import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminProductStatus } from '@/modules/admin-product/contracts/admin-product';
import {
  productStatusLabel,
  productStatusTone,
} from '@/modules/admin-product/utils/product-status-label';
import { formatAdminTimestamp } from '@/modules/admin-shell/utils/format-admin-timestamp';

export function PublishingSection({
  canPublish,
  status,
  updatedAt,
}: {
  canPublish: boolean;
  status: AdminProductStatus;
  updatedAt: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Trạng thái hiện tại</span>
        <Badge tone={productStatusTone(status)}>
          {productStatusLabel(status)}
        </Badge>
      </div>
      <p className="text-text-muted text-sm">
        Cập nhật lần cuối: {formatAdminTimestamp(updatedAt)}
      </p>
      {canPublish && (
        <div className="flex flex-wrap gap-3">
          {status !== 'published' && (
            <Button type="button" variant="secondary">
              Xuất bản
            </Button>
          )}
          {status === 'published' && (
            <Button type="button" variant="secondary">
              Hủy xuất bản
            </Button>
          )}
          {status !== 'archived' ? (
            <Button type="button" variant="danger">
              Lưu trữ
            </Button>
          ) : (
            <Button type="button" variant="secondary">
              Khôi phục
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
