import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service.js';
import { Post } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Ttl } from '../../common/utils/ttl.util.js';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @CacheTTL(Ttl.minutes(1))
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @CacheTTL(Ttl.minutes(3))
  findOne(@Param('id') id: Post['id']) {
    return this.postService.findOne(id);
  }
}
