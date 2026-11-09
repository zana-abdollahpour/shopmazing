import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash as bcryptHash } from 'bcrypt';

import { HashingService } from './hashing.abstract.service.js';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer<ArrayBufferLike>): Promise<string> {
    const salt = await genSalt();
    return bcryptHash(data, salt);
  }

  async compare(
    data: string | Buffer<ArrayBufferLike>,
    encrypted: string,
  ): Promise<boolean> {
    return compare(data, encrypted);
  }
}
