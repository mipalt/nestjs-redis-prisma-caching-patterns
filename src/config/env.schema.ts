import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  // database (Prisma contract)
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  // redis
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
});
