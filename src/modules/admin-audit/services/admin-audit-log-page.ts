import 'server-only';

import { cache } from 'react';

import { getAuditLog } from '@/modules/admin-auth/server/admin-audit-store';

const pageSize = 20;

export const getAdminAuditLogPage = cache(async (page: number) => {
  return getAuditLog({ page, pageSize });
});
