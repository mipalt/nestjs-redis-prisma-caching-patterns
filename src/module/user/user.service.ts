import { Injectable } from '@nestjs/common';
import { ServiceResponse } from '../../shared/types/response.interface.js';
import { UserResponse } from './interfaces/user.interface.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { userSelect } from './persistence/user.select.js';
import { success } from '../../common/utils/success.util.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ServiceResponse<UserResponse[]>> {
    const users = await this.prisma.user.findMany({
      select: userSelect,
    });
    return success(users);
  }
}
