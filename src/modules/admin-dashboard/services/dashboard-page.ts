import 'server-only';

import { cache } from 'react';

import { dashboardConfig } from '@/modules/admin-dashboard/dashboard-config';

export const getDashboardSnapshot = cache(async () => {
  return dashboardConfig.snapshotProvider({});
});
