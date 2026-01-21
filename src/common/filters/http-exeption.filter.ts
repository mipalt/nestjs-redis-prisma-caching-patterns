import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from 'src/prisma/generated/client.js';
import { handlePrismaError } from '../utils/prisma-exception.util.js';
import {
  ErrorResponse,
  HttpResponse,
} from 'src/shared/types/response.interface.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();

    const errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(exception);

      errorResponse.statusCode = HttpStatus.BAD_REQUEST;
      errorResponse.message = prismaError.message;
      errorResponse.errors = prismaError.errors;
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

          if (!errors[field]) {
            errors[field] = [];
          }

          errors[field].push(msg);
        });
      }
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
