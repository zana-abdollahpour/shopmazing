import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

import type { TokenPayload } from '@/src/iam/interfaces/token-payload.interface.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
