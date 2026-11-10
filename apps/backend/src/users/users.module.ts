import { Module } from '@nestjs/common';

import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

import { PrismaModule } from '@/src/prisma/prisma.module.js';
import { HashingModule } from '@/src/hashing/hashing.module.js';

@Module({
  imports: [PrismaModule, HashingModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
