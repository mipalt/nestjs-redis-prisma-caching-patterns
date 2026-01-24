import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service.js';
import { Post } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Time } from '../../common/utils/time.util.js';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @CacheTTL(Time.minute(1))
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @CacheTTL(Time.minute(3))
  findOne(@Param('id') id: Post['id']) {
    return this.postService.findOne(id);
  }
}
