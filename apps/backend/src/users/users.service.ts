import { Injectable } from '@nestjs/common';
import type { CreateUserDto } from '@repo/schemas/users';

@Injectable()
export class UsersService {
  createUser(dto: CreateUserDto) {
    console.log('CreateUserDto =>', dto);
  }
}
