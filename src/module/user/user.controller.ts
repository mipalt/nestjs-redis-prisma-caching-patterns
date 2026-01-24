import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from '../../prisma/generated/client.js';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Ttl } from '../../common/utils/ttl.util.js';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheTTL(Ttl.minutes(5))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @CacheTTL(Ttl.minutes(15))
  findOne(@Param('id') id: User['id']) {
    return this.userService.findOne(id);
  }
}
