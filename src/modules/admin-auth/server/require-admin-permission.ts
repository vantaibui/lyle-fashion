import 'server-only';

import { redirect } from 'next/navigation';

import { ApiError } from '@/lib/api/error';
import type { AdminPermission } from '@/modules/admin-auth/contracts/role';
import type { AdminSession } from '@/modules/admin-auth/contracts/session';

/**
 * Route Handler / Server Action guard. Throws ApiError(403) rather than
 * redirecting so callers can return a typed JSON error. UI visibility is
 * never treated as authorization; every mutating or resource-scoped read
 * must call this even if navigation already hid the control.
 */
export function assertAdminPermission(
  session: AdminSession,
  permission: AdminPermission,
): void {
  if (!session.permissions.includes(permission)) {
    throw new ApiError('Bạn không có quyền thực hiện thao tác này.', {
      code: 'AUTHORIZATION_ERROR',
      status: 403,
    });
  }
}

/**
 * Server Component guard. Redirects to the forbidden state instead of
 * throwing so a protected page can render a normal Next.js response.
 */
export function requirePagePermission(
  session: AdminSession,
  permission: AdminPermission,
): void {
  if (!session.permissions.includes(permission)) {
    redirect('/admin/forbidden');
  }
}
