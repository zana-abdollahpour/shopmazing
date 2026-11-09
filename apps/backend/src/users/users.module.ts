import { Module } from '@nestjs/common';

import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

import { PrismaModule } from '@/src/prisma/prisma.module.js';
import { IamModule } from '@/src/iam/iam.module.js';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
