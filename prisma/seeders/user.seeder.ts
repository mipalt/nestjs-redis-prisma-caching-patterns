import { PasswordUtil } from "../../src/common/utils/password.util.js";
import { runSingleSeeder } from "../../src/common/utils/seeder.util.js";
import { PrismaClient } from "../../src/prisma/generated/client.js";

export async function userSeeder(prisma: PrismaClient) {
  console.log('[USER] Starting user seed');

  const hashedPassword = await PasswordUtil.hash('password');

  try {
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: [
        {
          name: 'Admin',
          email: 'admin@example.com',
          password: hashedPassword,
        },
        {
          name: 'User',
          email: 'user@example.com',
          password: hashedPassword,
        },
      ],
    });

    console.log('[USER] User seed completed');
  } catch (err) {
    console.error('[USER] User seed failed:', err);
    throw err;
  }
}

runSingleSeeder(import.meta.url, userSeeder);
