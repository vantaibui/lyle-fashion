import {
  mockCatalogAdapter,
  mockCatalogLandingAdapter,
} from '@/modules/catalog/api/mock-catalog-adapter';

// Temporary server adapter selection until the commerce backend is approved.
export const catalogConfig = {
  pageSize: 8,
  landingProvider: mockCatalogLandingAdapter,
  resultProvider: mockCatalogAdapter,
} as const;
