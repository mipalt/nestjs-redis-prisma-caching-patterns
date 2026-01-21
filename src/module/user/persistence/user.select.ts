import { Prisma } from '../../../prisma/generated/client.js';

export const userSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;
