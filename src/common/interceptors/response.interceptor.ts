import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  ApiResponse,
  ServiceResponse,
} from '../../shared/types/response.interface.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  ServiceResponse<T>,
  ApiResponse<T>
> {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<ServiceResponse<T>>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((result: ServiceResponse<T>) => {
        const res = ctx.switchToHttp().getResponse();
        const statusCode = res.statusCode || 200;

        return {
          statusCode,
          success: statusCode >= 200 && statusCode < 300,
          message: result.message || 'Success',
          data: result.data,
          meta: result.meta,
        };
      }),
    );
  }
}
