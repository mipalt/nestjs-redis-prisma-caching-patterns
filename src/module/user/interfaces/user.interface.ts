import { User } from '../../../prisma/generated/client.js';

export type UserResponse = Pick<User, 'id' | 'name' | 'email'>;
