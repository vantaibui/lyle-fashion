export const adminRoles = [
  'SUPER_ADMIN',
  'ADMIN',
  'ECOMMERCE_MANAGER',
  'MERCHANDISER',
  'CONTENT_EDITOR',
  'MARKETING',
  'ORDER_OPERATOR',
  'WAREHOUSE_STAFF',
  'CUSTOMER_SUPPORT',
  'VIEWER',
] as const;

export type AdminRole = (typeof adminRoles)[number];

export const adminPermissions = [
  'product.read',
  'product.create',
  'product.update',
  'product.publish',
  'product.archive',

  'inventory.read',
  'inventory.update',
  'inventory.adjust',

  'order.read',
  'order.update',
  'order.cancel',
  'order.fulfill',
  'order.refund',

  'promotion.read',
  'promotion.create',
  'promotion.update',
  'promotion.activate',

  'content.read',
  'content.create',
  'content.update',
  'content.publish',

  'customer.read',
  'customer.update',

  'admin-user.read',
  'admin-user.manage',

  'audit-log.read',
] as const;

export type AdminPermission = (typeof adminPermissions)[number];

/**
 * Least-privilege defaults derived from docs/ECOMMERCE-FUNCTIONAL-SCOPE.md role
 * boundaries. Business must approve before this governs production access.
 */
export const rolePermissions: Readonly<
  Record<AdminRole, readonly AdminPermission[]>
> = {
  SUPER_ADMIN: [...adminPermissions],
  ADMIN: [
    'product.read',
    'product.create',
    'product.update',
    'product.publish',
    'product.archive',
    'inventory.read',
    'inventory.update',
    'inventory.adjust',
    'order.read',
    'order.update',
    'order.cancel',
    'order.fulfill',
    'order.refund',
    'promotion.read',
    'promotion.create',
    'promotion.update',
    'promotion.activate',
    'content.read',
    'content.create',
    'content.update',
    'content.publish',
    'customer.read',
    'customer.update',
    'admin-user.read',
    'audit-log.read',
  ],
  ECOMMERCE_MANAGER: [
    'product.read',
    'product.update',
    'product.publish',
    'inventory.read',
    'inventory.update',
    'order.read',
    'order.update',
    'promotion.read',
    'promotion.create',
    'promotion.update',
    'content.read',
    'customer.read',
    'audit-log.read',
  ],
  MERCHANDISER: [
    'product.read',
    'product.create',
    'product.update',
    'product.publish',
    'inventory.read',
    'content.read',
  ],
  CONTENT_EDITOR: [
    'content.read',
    'content.create',
    'content.update',
    'product.read',
  ],
  MARKETING: [
    'promotion.read',
    'promotion.create',
    'content.read',
    'content.create',
  ],
  ORDER_OPERATOR: [
    'order.read',
    'order.update',
    'order.cancel',
    'order.fulfill',
    'customer.read',
  ],
  WAREHOUSE_STAFF: [
    'inventory.read',
    'inventory.update',
    'inventory.adjust',
    'order.read',
  ],
  CUSTOMER_SUPPORT: ['order.read', 'customer.read'],
  VIEWER: [
    'product.read',
    'inventory.read',
    'order.read',
    'promotion.read',
    'content.read',
    'customer.read',
  ],
};

export function permissionsForRole(
  role: AdminRole,
): readonly AdminPermission[] {
  return rolePermissions[role];
}

export function roleHasPermission(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return rolePermissions[role].includes(permission);
}
