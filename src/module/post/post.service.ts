import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ServiceResponse } from '../../shared/types/response.interface.js';
import { success } from '../../common/utils/success.util.js';
import { PostResponse } from './interfaces/post.interface.js';
import { postSelect } from './persistence/post.select.js';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ServiceResponse<PostResponse[]>> {
    const posts = await this.prisma.post.findMany({ select: postSelect });
    return success(posts);
  }
}
