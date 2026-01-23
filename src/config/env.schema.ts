import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  // database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL must not be empty'),

  // server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  // redis
  REDIS_HOST: z.string().min(1, 'REDIS_HOST must not be empty'),
  REDIS_PORT: z.coerce
    .number()
    .int('REDIS_PORT must be an integer')
    .positive('REDIS_PORT must be greater than 0')
    .default(6379),
});
