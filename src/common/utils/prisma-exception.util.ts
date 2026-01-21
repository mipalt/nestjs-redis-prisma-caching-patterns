import { HttpStatus } from '@nestjs/common';
import { Prisma } from '../../prisma/generated/client.js';
import { ErrorResponse } from 'src/shared/types/response.interface.js';

export function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): ErrorResponse {
  const modelName = (error.meta?.modelName as string) || 'Data';
  const target = (error.meta?.target as string[]) || [];

  switch (error.code) {
    case 'P2002':
      return {
        statusCode: HttpStatus.CONFLICT,
        message: `${modelName} already exists`,
        errors: target.length
          ? { [target[0]]: [`${target[0]} must be unique`] }
          : undefined,
      };
    case 'P2025':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${modelName} not found`,
      };
    case 'P2003':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Related record not found',
      };
    case 'P2000':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Value too long for field',
      };
    case 'P2001':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Table ${modelName} not found`,
      };
    case 'P2005':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid value type',
      };
    case 'P2006':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid enum value',
      };
    case 'P2007':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Data validation failed',
      };
    case 'P2011':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Null constraint violation',
      };
    case 'P2010':
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Query failed',
      };
    default:
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Database error',
      };
  }
}
