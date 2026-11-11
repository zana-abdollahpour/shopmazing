import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@/src/users/users.module.js';
import { HashingModule } from '@/src/hashing/hashing.module.js';

import { AuthenticationService } from './authentication/authentication.service.js';
import { AuthenticationController } from './authentication/authentication.controller.js';
import { LocalStrategy } from './authentication/strategies/local.strategy.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRATION') },
      }),
    }),
    ConfigModule,
    UsersModule,
    HashingModule,
  ],
  providers: [AuthenticationService, LocalStrategy],
  controllers: [AuthenticationController],
  exports: [],
})
export class IamModule {}
