import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users:all')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: User['id']) {
    return this.userService.findOne(id);
  }
}
