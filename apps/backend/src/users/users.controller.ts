import { Body, Controller, Post } from '@nestjs/common';
import { createUserSchema, type CreateUserDto } from '@repo/schemas/users';

import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body({ schema: createUserSchema }) dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
