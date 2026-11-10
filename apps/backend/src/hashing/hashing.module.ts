import { Module } from '@nestjs/common';

import { HashingService } from './hashing.abstract.service.js';
import { BcryptService } from './bcrypt.service.js';

@Module({
  providers: [{ provide: HashingService, useClass: BcryptService }],
  exports: [HashingService],
})
export class HashingModule {}
