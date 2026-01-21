import 'dotenv/config';
import z from 'zod';

export const envSchema = z.object({
  // database
  DATABASE_URL: z.string(),

  // server
  PORT: z.coerce.number().default(3000),
});
