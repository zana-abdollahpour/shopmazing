import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { type StringValue } from 'ms';
import type { Response } from 'express';

import { HashingService } from '@/src/hashing/hashing.abstract.service.js';
import { UsersService } from '@/src/users/users.service.js';
import { TokenPayload } from '@/src/iam/interfaces/token-payload.interface.js';
import { User } from '@/src/generated/prisma/client.js';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const now = new Date();
    const expiry = this.configService.getOrThrow<StringValue>('JWT_EXPIRATION');
    const expires = new Date(now.getMilliseconds() + ms(expiry));

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires: expires,
    });

    return { tokenPayload };
  }

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
