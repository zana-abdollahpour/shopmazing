import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';

import { createUserSchema, type CreateUserDto } from '@repo/schemas/users';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body({ schema: createUserSchema }) dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
