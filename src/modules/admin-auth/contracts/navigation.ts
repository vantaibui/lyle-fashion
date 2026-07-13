import type { AdminPermission } from '@/modules/admin-auth/contracts/role';

export type AdminNavItem = {
  href: string;
  label: string;
  permission: AdminPermission;
};

export type AdminNavGroup = {
  id: string;
  items: readonly AdminNavItem[];
  label: string;
};

/**
 * Groups mirror docs/ADMIN-FUNCTIONAL-SCOPE.md navigation structure. Only
 * modules implemented in this phase link to a real route; future modules
 * are intentionally absent rather than linking to unbuilt pages.
 */
export const adminNavigation: readonly AdminNavGroup[] = [
  {
    id: 'overview',
    items: [{ href: '/admin', label: 'Tổng quan', permission: 'product.read' }],
    label: 'Tổng quan',
  },
  {
    id: 'catalog',
    items: [
      {
        href: '/admin/products',
        label: 'Sản phẩm',
        permission: 'product.read',
      },
    ],
    label: 'Danh mục sản phẩm',
  },
  {
    id: 'orders',
    items: [
      { href: '/admin/orders', label: 'Đơn hàng', permission: 'order.read' },
    ],
    label: 'Đơn hàng',
  },
  {
    id: 'administration',
    items: [
      {
        href: '/admin/audit-log',
        label: 'Nhật ký hoạt động',
        permission: 'audit-log.read',
      },
    ],
    label: 'Quản trị',
  },
];
