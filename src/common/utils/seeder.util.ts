import { fileURLToPath } from 'url';
import { PrismaClient } from '../../prisma/generated/client.js';
import { PrismaUtil } from './prisma.util.js';

export function runSingleSeeder(
  metaUrl: string,
  handler: (prisma: PrismaClient) => Promise<void>,
) {
  const __filename = fileURLToPath(metaUrl);

  if (process.argv[1] !== __filename) {
    return;
  }

  const prisma = PrismaUtil.prismaClient();

  handler(prisma)
    .catch((err) => {
      console.error('[SEED] Seeder failed:', err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
