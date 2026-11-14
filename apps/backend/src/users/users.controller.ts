import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';

import { createUserSchema, type CreateUserDto } from '@repo/schemas/users';
import { UsersService } from './users.service.js';
import { JwtAuthenticationGuard } from '@/src/iam/authentication/guards/jwt-authentication.guard.js';
import { CurrentUser } from '@/src/iam/authentication/decorators/current-user.decorator.js';
import type { TokenPayload } from '@/src/iam/interfaces/token-payload.interface.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body({ schema: createUserSchema }) dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
