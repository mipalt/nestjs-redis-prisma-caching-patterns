import { Prisma } from '../../../prisma/generated/client.js';
import { userSelect } from '../../user/persistence/user.select.js';

export const postSelect = {
  id: true,
  title: true,
  content: true,
  author: {
    select: { ...userSelect, email: false },
  },
} satisfies Prisma.PostSelect;
