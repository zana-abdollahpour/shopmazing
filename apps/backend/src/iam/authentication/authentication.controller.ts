import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { CurrentUser } from '@/src/iam/authentication/decorators/current-user.decorator.js';
import { AuthenticationService } from '@/src/iam/authentication/authentication.service.js';
import { LocalAuthenticationGuard } from '@/src/iam/authentication/guards/local-authentication.guard.js';
import type { User } from '@/src/generated/prisma/client.js';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authenticationService.login(user, response);
  }
}
