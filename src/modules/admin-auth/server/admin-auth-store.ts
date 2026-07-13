import 'server-only';

import { ApiError } from '@/lib/api/error';
import { permissionsForRole } from '@/modules/admin-auth/contracts/role';
import type { AdminSession } from '@/modules/admin-auth/contracts/session';
import { recordAuditEvent } from '@/modules/admin-auth/server/admin-audit-store';

export const ADMIN_SESSION_COOKIE_NAME = 'lyle_admin_session';
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 4;
const DEVELOPMENT_ADMIN_SESSION_TOKEN = 'development-admin-demo';
const DEVELOPMENT_ADMIN_ID = 'admin_demo';

type CookieReader = { get(name: string): { value: string } | undefined };

const sessions = new Map<string, AdminSession>();

function clone<T>(value: T): T {
  return structuredClone(value);
}

/**
 * Development reference adapter only. It is intentionally isolated from
 * src/modules/account/server/account-store.ts: no shared credential store,
 * no shared cookie name, no shared session map. Production must delegate to
 * an approved staff identity provider with MFA per ADM-01/ADM-03 in
 * docs/OPEN-QUESTIONS.md; this adapter must never receive real staff
 * credentials.
 */
export function authenticateDemoAdmin(email: string, password: string) {
  if (
    email.toLowerCase() !== 'admin@lyle.vn' ||
    password !== 'LyleAdmin!2026'
  ) {
    throw new ApiError('Không thể đăng nhập với thông tin đã cung cấp.', {
      code: 'AUTHENTICATION_ERROR',
      status: 401,
    });
  }

  const token = DEVELOPMENT_ADMIN_SESSION_TOKEN;
  const role = 'SUPER_ADMIN' as const;
  const session: AdminSession = {
    adminUserId: DEVELOPMENT_ADMIN_ID,
    expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL_MS).toISOString(),
    permissions: permissionsForRole(role),
    role,
  };
  sessions.set(token, session);
  recordAuditEvent({
    action: 'admin.login',
    actorId: session.adminUserId,
    actorRole: session.role,
    resourceId: session.adminUserId,
    resourceType: 'admin_session',
    safeSummary: 'Admin signed in.',
  });

  return { cookie: buildAdminSessionCookie(token), session: clone(session) };
}

export function buildAdminSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_TTL_MS / 1000}${secure}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export function endAdminSession(cookies: CookieReader) {
  const token = cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return;
  const session = sessions.get(token);
  sessions.delete(token);
  if (session)
    recordAuditEvent({
      action: 'admin.logout',
      actorId: session.adminUserId,
      actorRole: session.role,
      resourceId: session.adminUserId,
      resourceType: 'admin_session',
      safeSummary: 'Admin signed out.',
    });
}

/**
 * Reconstructs the session directly from the fixed development token rather
 * than depending solely on the in-process `sessions` Map lookup succeeding
 * (mirrors src/modules/account/server/account-store.ts:getSession). A
 * multi-worker dev/production runtime cannot guarantee the request that
 * reads a session lands on the same process that wrote it to an in-memory
 * Map; the durable production store must not repeat this constraint.
 *
 * Trade-off accepted for this fixture only: because the session is
 * reconstructed from the token itself, `endAdminSession` cannot make this
 * fixed demo token stop authenticating — only clearing the browser's cookie
 * (via clearAdminSessionCookie) prevents it from being resent. A durable
 * production store must invalidate the underlying session, not rely on
 * cookie deletion alone.
 */
export function getAdminSession(cookies: CookieReader): AdminSession | null {
  const token = cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (token !== DEVELOPMENT_ADMIN_SESSION_TOKEN) return null;

  const role = 'SUPER_ADMIN' as const;
  const session: AdminSession =
    sessions.get(token) ??
    ({
      adminUserId: DEVELOPMENT_ADMIN_ID,
      expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL_MS).toISOString(),
      permissions: permissionsForRole(role),
      role,
    } satisfies AdminSession);

  if (Date.parse(session.expiresAt) <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return clone(session);
}
