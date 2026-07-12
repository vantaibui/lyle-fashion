'use client';

import { useEffect } from 'react';

import { noStorefrontAnalytics } from '@/lib/analytics/storefront-events';

export function CatalogImpression({
  listId,
  total,
}: {
  listId: string;
  total: number;
}) {
  useEffect(() => {
    noStorefrontAnalytics({
      name: 'view_item_list',
      properties: { listId, total },
    });
  }, [listId, total]);

  return null;
}
