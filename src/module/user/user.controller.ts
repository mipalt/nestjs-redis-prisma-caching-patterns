import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from '../../prisma/generated/client.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: User['id']) {
    return this.userService.findOne(id);
  }
}
