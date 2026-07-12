import { apiRequest } from '@/lib/api/request';

type BrowserApiOptions = Parameters<typeof apiRequest>[1];

export function browserApiRequest<TData>(
  path: `/${string}`,
  options: BrowserApiOptions = {},
) {
  return apiRequest<TData>(path, {
    ...options,
    credentials: 'same-origin',
  });
}
