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

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();

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

      if (Array.isArray(res.message)) {
        errorResponse.message = 'Validation failed';
        errorResponse.errors = {};

        res.message.forEach((msg: string) => {
          const field = msg.split(' ')[0].toLowerCase();
          const errors = errorResponse.errors as Record<string, string[]>;

          errors[field] ??= [];
          errors[field].push(msg);
        });
      }
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
