import { runSingleSeeder } from '../../src/common/utils/seeder.util.js';
import { PrismaClient } from '../../src/prisma/generated/client.js';

export async function postSeeder(prisma: PrismaClient) {
  console.log('[POST] Starting post seed');

  try {
    await prisma.post.deleteMany();

    const users = await prisma.user.findMany();

    if (!users.length) {
      console.warn('[POST] No users found. Skipping post seeding');
      return;
    }

    const posts = users.flatMap((user) =>
      Array.from({ length: 5 }, (_, idx) => {
        const postIndex = idx + 1;

        return {
          authorId: user.id,
          title: `Post ${postIndex} oleh User ${user.name}`,
          content: `Ini adalah konten untuk Post ${postIndex} yang dibuat oleh User ${user.name}.`,
        };
      }),
    );

    await prisma.post.createMany({ data: posts });

    console.log('[POST] Post seed completed');
  } catch (err) {
    console.error('[POST] Post seed failed:', err);
    throw err;
  }
}

runSingleSeeder(import.meta.url, postSeeder);
