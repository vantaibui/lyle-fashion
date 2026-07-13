import type { AdminRole } from '@/modules/admin-auth/contracts/role';

export const auditLogActions = [
  'admin.login',
  'admin.logout',
  'product.created',
  'product.updated',
  'product.published',
  'product.archived',
  'variant.updated',
  'inventory.adjusted',
  'order.status_changed',
  'refund.initiated',
  'promotion.changed',
  'content.published',
  'admin_permission.changed',
] as const;

export type AuditLogAction = (typeof auditLogActions)[number];

export const auditLogResourceTypes = [
  'admin_session',
  'product',
  'variant',
  'inventory',
  'order',
  'refund',
  'promotion',
  'content',
  'admin_user',
] as const;

export type AuditLogResourceType = (typeof auditLogResourceTypes)[number];

/**
 * Safe audit record shape. `previousValue`/`newValue` must carry only
 * fields approved for audit exposure (never secrets, payment data, or full
 * customer PII) per docs/SECURITY-GUIDELINES.md.
 */
export type AuditLogEntry = {
  action: AuditLogAction;
  actorId: string;
  actorRole: AdminRole;
  eventId: string;
  newValue?: Readonly<Record<string, unknown>>;
  previousValue?: Readonly<Record<string, unknown>>;
  requestId?: string;
  resourceId: string;
  resourceType: AuditLogResourceType;
  safeSummary: string;
  timestamp: string;
};

export type AuditLogEntryInput = Omit<AuditLogEntry, 'eventId' | 'timestamp'>;

/**
 * Server-only write boundary. The in-memory implementation
 * (admin-audit-store.ts) is a development foundation only; production
 * requires durable, append-only, tamper-evident storage.
 */
export type AuditLogWriter = (entry: AuditLogEntryInput) => AuditLogEntry;

export type AuditLogReader = (options: { page: number; pageSize: number }) => {
  items: AuditLogEntry[];
  page: number;
  pageSize: number;
  total: number;
};
