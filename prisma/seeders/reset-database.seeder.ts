import { PrismaUtil } from '../../src/common/utils/prisma.util.js';

const prisma = PrismaUtil.prismaClient();

const modelsToReset = ['user'];

export async function resetDatabase() {
  try {
    for (const model of modelsToReset) {
      if (prisma[model] && typeof prisma[model].deleteMany === 'function') {
        await prisma[model].deleteMany();
        console.log(`[SEED] Cleared ${model}`);
      }
    }
    console.log('[SEED] Database reset complete');
  } catch (error) {
    console.error('[SEED] Failed to reset database');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
