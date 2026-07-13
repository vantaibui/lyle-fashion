import type { AuditLogAction } from '@/modules/admin-auth/contracts/audit-log';

const auditActionLabels: Readonly<Record<AuditLogAction, string>> = {
  'admin.login': 'Đăng nhập quản trị',
  'admin.logout': 'Đăng xuất quản trị',
  'product.created': 'Tạo sản phẩm',
  'product.updated': 'Cập nhật sản phẩm',
  'product.published': 'Xuất bản sản phẩm',
  'product.archived': 'Lưu trữ sản phẩm',
  'variant.updated': 'Cập nhật biến thể',
  'inventory.adjusted': 'Điều chỉnh tồn kho',
  'order.status_changed': 'Thay đổi trạng thái đơn hàng',
  'refund.initiated': 'Khởi tạo hoàn tiền',
  'promotion.changed': 'Thay đổi khuyến mãi',
  'content.published': 'Xuất bản nội dung',
  'admin_permission.changed': 'Thay đổi quyền quản trị',
};

export function auditActionLabel(action: AuditLogAction): string {
  return auditActionLabels[action];
}
