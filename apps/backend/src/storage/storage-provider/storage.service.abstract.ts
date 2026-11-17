import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class StorageService {
  abstract upload(productId: number, fileBuffer: Buffer): Promise<void>;
  abstract fileExists(fileName: string): Promise<boolean>;
}
