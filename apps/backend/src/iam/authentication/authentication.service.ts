import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '@/src/users/users.service.js';
import { HashingService } from '@/src/hashing/hashing.abstract.service.js';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const isPasswordCorrect = this.hashingService.compare(
        password,
        user.password,
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedException('Email or password is incorrect');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }
}
