import type {
  AdminPermission,
  AdminRole,
} from '@/modules/admin-auth/contracts/role';

export type AdminSession = {
  adminUserId: string;
  expiresAt: string;
  permissions: readonly AdminPermission[];
  role: AdminRole;
};

export type AdminLoginInput = {
  email: string;
  password: string;
  returnTo?: string;
};

/**
 * Pure, universally-safe check usable from client and server code (e.g. to
 * filter navigation). It never authorizes an action by itself — server
 * route handlers and Server Components must still call
 * assertAdminPermission/requirePagePermission from
 * modules/admin-auth/server/require-admin-permission.ts.
 */
export function hasAdminPermission(
  session: AdminSession,
  permission: AdminPermission,
): boolean {
  return session.permissions.includes(permission);
}
