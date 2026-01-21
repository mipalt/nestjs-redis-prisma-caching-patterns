import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  // database
  DATABASE_URL: z.string(),

  // server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});
