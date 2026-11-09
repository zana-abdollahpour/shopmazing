import { Module } from '@nestjs/common';

import { HashingService } from './hashing/hashing.abstract.service.js';
import { BcryptService } from './hashing/bcrypt.service.js';

@Module({
  providers: [{ provide: HashingService, useClass: BcryptService }],
  exports: [HashingService],
})
export class IamModule {}
