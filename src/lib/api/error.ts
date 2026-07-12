export const apiErrorCodes = [
  'VALIDATION_ERROR',
  'AUTHENTICATION_ERROR',
  'AUTHORIZATION_ERROR',
  'NOT_FOUND',
  'CONFLICT',
  'INVENTORY_CONFLICT',
  'PRICING_CONFLICT',
  'RATE_LIMITED',
  'NETWORK_ERROR',
  'TIMEOUT',
  'UNEXPECTED_SERVER_ERROR',
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

type ApiErrorOptions = {
  cause?: unknown;
  code?: ApiErrorCode;
  details?: Readonly<Record<string, unknown>>;
  requestId?: string;
  retryable?: boolean;
  status?: number;
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly status?: number;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.code = options.code ?? 'UNEXPECTED_SERVER_ERROR';
    this.details = options.details;
    this.requestId = options.requestId;
    this.retryable = options.retryable ?? false;
    this.status = options.status;
  }
}

const statusCodeMap: Readonly<Record<number, ApiErrorCode>> = {
  400: 'VALIDATION_ERROR',
  401: 'AUTHENTICATION_ERROR',
  403: 'AUTHORIZATION_ERROR',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'RATE_LIMITED',
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('Yêu cầu đã bị hủy.', {
      cause: error,
      code: 'NETWORK_ERROR',
      retryable: true,
    });
  }

  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return new ApiError('Yêu cầu đã hết thời gian chờ.', {
      cause: error,
      code: 'TIMEOUT',
      retryable: true,
    });
  }

  if (error instanceof TypeError) {
    return new ApiError('Không thể kết nối đến dịch vụ.', {
      cause: error,
      code: 'NETWORK_ERROR',
      retryable: true,
    });
  }

  return new ApiError('Đã xảy ra lỗi không mong muốn.', { cause: error });
}

export function apiErrorFromResponse(response: Response): ApiError {
  const code = statusCodeMap[response.status] ?? 'UNEXPECTED_SERVER_ERROR';
  const requestId = response.headers.get('x-request-id') ?? undefined;

  return new ApiError('Dịch vụ không thể hoàn tất yêu cầu.', {
    code,
    requestId,
    retryable: response.status === 429 || response.status >= 500,
    status: response.status,
  });
}
