import { Prisma } from '../../../prisma/generated/client.js';

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
};
