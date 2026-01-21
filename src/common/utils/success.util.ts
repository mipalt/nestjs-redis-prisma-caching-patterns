import { ServiceResponse } from '../../shared/types/response.interface.js';

export type SuccessOptions = Pick<ServiceResponse<unknown>, 'message' | 'meta'>;

export function success<T>(
  data: T,
  options?: SuccessOptions,
): ServiceResponse<T> {
  return {
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.meta && { meta: options.meta }),
  };
}
