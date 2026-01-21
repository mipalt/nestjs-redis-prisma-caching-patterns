import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../../logger/logger.service.js';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const message = `${req.method} ${req.originalUrl} ${res.statusCode} ~ ${duration}ms`;

          if (res.statusCode >= 400) {
            this.logger.error(message, {
              ip: req.ip,
              statusMessage: res.statusMessage,
            });
          } else {
            this.logger.info(message);
          }
        },
        error: (err) => {
          const duration = Date.now() - start;
          const message = `${req.method} ${req.originalUrl} 500 ~ ${duration}ms`;

          this.logger.error(message, {
            ip: req.ip,
            error: err.message,
          });
        },
      }),
    );
  }
}
