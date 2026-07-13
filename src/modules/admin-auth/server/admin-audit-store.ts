import 'server-only';

import type {
  AuditLogEntry,
  AuditLogEntryInput,
  AuditLogReader,
  AuditLogWriter,
} from '@/modules/admin-auth/contracts/audit-log';

/**
 * In-memory, single-process development foundation only. Production
 * requires durable, append-only, tamper-evident storage independent of
 * application server lifecycle.
 */
const entries: AuditLogEntry[] = [];

export const recordAuditEvent: AuditLogWriter = (input: AuditLogEntryInput) => {
  const entry: AuditLogEntry = {
    ...input,
    eventId: `audit_${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
  };
  entries.unshift(entry);
  return entry;
};

export const getAuditLog: AuditLogReader = ({ page, pageSize }) => {
  const start = (page - 1) * pageSize;
  return {
    items: entries
      .slice(start, start + pageSize)
      .map((entry) => ({ ...entry })),
    page,
    pageSize,
    total: entries.length,
  };
};
