import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service.js';
import { Post } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('posts:all')
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Post['id']) {
    return this.postService.findOne(id);
  }
}
