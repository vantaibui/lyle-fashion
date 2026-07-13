import { mockDashboardAdapter } from '@/modules/admin-dashboard/api/mock-dashboard-adapter';

// Temporary server adapter selection until OMS/WMS/promotion backends are approved.
export const dashboardConfig = {
  snapshotProvider: mockDashboardAdapter,
} as const;
