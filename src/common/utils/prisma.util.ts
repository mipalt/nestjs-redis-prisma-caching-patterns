import { PrismaPg } from '@prisma/adapter-pg';
import { envSchema } from '../../config/env.schema.js';
import { PrismaClient } from '../../prisma/generated/client.js';

const env = envSchema.parse(process.env);

export class PrismaUtil {
  static prismaPg() {
    return new PrismaPg({
      connectionString: env.DATABASE_URL,
    });
  }

  static prismaClient() {
    return new PrismaClient({
      adapter: this.prismaPg(),
    });
  }
}
