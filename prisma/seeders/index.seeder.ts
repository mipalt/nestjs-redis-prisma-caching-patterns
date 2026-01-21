import { PrismaUtil } from '../../src/common/utils/prisma.util.js';
import { userSeeder } from './user.seeder.js';

const prisma = PrismaUtil.prismaClient();

async function main() {
  await userSeeder(prisma);
}

main()
  .catch((err) => {
    console.error('[SEED] Seeding failed ❌:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
