import { LocalAuthenticationGuard } from '@/src/iam/authentication/guards/local-authentication.guard.js';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthenticationController {
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login() {}
}
