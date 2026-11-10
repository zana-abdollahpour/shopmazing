import { Module } from '@nestjs/common';

import { UsersModule } from '@/src/users/users.module.js';

import { AuthenticationService } from './authentication/authentication.service.js';
import { AuthenticationController } from './authentication/authentication.controller.js';
import { LocalStrategy } from './authentication/strategies/local.strategy.js';
import { HashingModule } from '@/src/hashing/hashing.module.js';

@Module({
  imports: [UsersModule, HashingModule],
  providers: [AuthenticationService, LocalStrategy],
  controllers: [AuthenticationController],
  exports: [],
})
export class IamModule {}
