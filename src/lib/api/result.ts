import type { ApiError } from '@/lib/api/error';

export type ApiResult<TData> =
  | { data: TData; error: null; requestId?: string }
  | { data: null; error: ApiError; requestId?: string };
