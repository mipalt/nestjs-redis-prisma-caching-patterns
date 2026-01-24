import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../prisma/generated/client.js';
import { handlePrismaError } from '../utils/prisma-exception.util.js';
import {
  ErrorResponse,
  HttpResponse,
} from '../../shared/types/response.interface.js';
import { LoggerService } from '../../logger/logger.service.js';
import { ConfigService } from '@nestjs/config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();
    const request = ctx.getRequest();

    let errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = handlePrismaError(
        exception as Prisma.PrismaClientKnownRequestError,
      );
      errorResponse = {
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        errors: prismaError.errors,
      };
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      errorResponse.statusCode = exception.getStatus();
      errorResponse.message = res.message || exception.message;
    }

    const nodeEnv = this.config.get('app.nodeEnv', { infer: true });
    this.logger.error(
      `${request.method} ${request.originalUrl} ${errorResponse.statusCode}`,
      {
        ip: request.ip,
        message: errorResponse.message,
        stack:
          nodeEnv === 'development'
            ? exception instanceof Error
              ? exception.stack
              : undefined
            : undefined,
      },
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
