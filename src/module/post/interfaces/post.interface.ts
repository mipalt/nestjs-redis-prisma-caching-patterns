import { Post, User } from '../../../prisma/generated/client.js';

export type PostResponse = Pick<Post, 'id' | 'title' | 'content'> & {
  author: Pick<User, 'id' | 'name'>;
};
