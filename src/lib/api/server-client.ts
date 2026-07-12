import 'server-only';

import { serverEnv } from '@/config/env/server';
import { apiRequest } from '@/lib/api/request';

type ServerApiOptions = Parameters<typeof apiRequest>[1];

export function commerceServerRequest<TData>(
  path: `/${string}`,
  options: ServerApiOptions = {},
) {
  if (!serverEnv.COMMERCE_API_URL) {
    throw new Error('COMMERCE_API_URL is required for commerce requests.');
  }

  const url = new URL(path, serverEnv.COMMERCE_API_URL);
  const headers = new Headers(options.headers);
  if (serverEnv.COMMERCE_API_TOKEN) {
    headers.set('Authorization', `Bearer ${serverEnv.COMMERCE_API_TOKEN}`);
  }

  return apiRequest<TData>(url, { ...options, headers });
}
