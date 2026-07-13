import type { AdminRole } from '@/modules/admin-auth/contracts/role';

const roleLabels: Readonly<Record<AdminRole, string>> = {
  SUPER_ADMIN: 'Quản trị tối cao',
  ADMIN: 'Quản trị viên',
  ECOMMERCE_MANAGER: 'Quản lý thương mại điện tử',
  MERCHANDISER: 'Chuyên viên hàng hóa',
  CONTENT_EDITOR: 'Biên tập nội dung',
  MARKETING: 'Marketing',
  ORDER_OPERATOR: 'Vận hành đơn hàng',
  WAREHOUSE_STAFF: 'Nhân viên kho',
  CUSTOMER_SUPPORT: 'Chăm sóc khách hàng',
  VIEWER: 'Chỉ xem',
};

export function adminRoleLabel(role: AdminRole): string {
  return roleLabels[role];
}
