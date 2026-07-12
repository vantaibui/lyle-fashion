export type ApiSuccess<TData> = {
  data: TData;
  error: null;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  data: null;
  error: {
    code: string;
    message: string;
    status?: number;
  };
};

export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;
