import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service.js';
import { Post } from '../../prisma/generated/client.js';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Post['id']) {
    return this.postService.findOne(id);
  }
}
