import { describe, expect, it } from 'vitest';

import { adminRoles, permissionsForRole, roleHasPermission } from './role';

describe('roleHasPermission', () => {
  it('grants SUPER_ADMIN every defined permission', () => {
    expect(roleHasPermission('SUPER_ADMIN', 'admin-user.manage')).toBe(true);
    expect(roleHasPermission('SUPER_ADMIN', 'audit-log.read')).toBe(true);
  });

  it('denies WAREHOUSE_STAFF catalog publish permissions', () => {
    expect(roleHasPermission('WAREHOUSE_STAFF', 'product.publish')).toBe(false);
    expect(roleHasPermission('WAREHOUSE_STAFF', 'inventory.adjust')).toBe(true);
  });

  it('denies VIEWER any mutating permission', () => {
    expect(roleHasPermission('VIEWER', 'product.create')).toBe(false);
    expect(roleHasPermission('VIEWER', 'order.update')).toBe(false);
    expect(roleHasPermission('VIEWER', 'product.read')).toBe(true);
  });

  it('defines permissions for every declared role', () => {
    for (const role of adminRoles) {
      expect(permissionsForRole(role).length).toBeGreaterThan(0);
    }
  });
});
