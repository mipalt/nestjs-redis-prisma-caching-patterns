export interface BaseResponse {
  message?: string;
  meta?: { [key: string]: any };
}

export interface ServiceResponse<T> extends BaseResponse {
  data?: T;
}

export interface ApiResponse<T> extends BaseResponse {
  statusCode: number;
  success: boolean;
  data?: T;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: string | Record<string, unknown>;
}

export interface HttpResponse {
  status: (code: number) => HttpResponse;
  json: (body: unknown) => void;
}
