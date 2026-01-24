import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Time } from '../../common/utils/time.util.js';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheTTL(Time.minute(5))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @CacheTTL(Time.minute(15))
  findOne(@Param('id') id: User['id']) {
    return this.userService.findOne(id);
  }
}
