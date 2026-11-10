import { Injectable } from '@nestjs/common';

type PlainText = string | Buffer;

@Injectable()
export abstract class HashingService {
  abstract hash(data: PlainText): Promise<string>;

  abstract compare(data: PlainText, encrypted: string): Promise<boolean>;
}
