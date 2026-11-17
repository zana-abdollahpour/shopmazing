import { DynamicModule, Module } from '@nestjs/common';

import { StorageService } from './storage-provider/storage.service.abstract.js';
import { AwsS3Service } from './storage-provider/aws-s3.service.js';

export interface StorageModuleOptions {
  region: string;
  bucket: string;
}

@Module({})
export class StorageModule {
  static forFeature(options: StorageModuleOptions): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        {
          provide: StorageService,
          useFactory: () => new AwsS3Service(options.region, options.bucket),
        },
      ],
      exports: [StorageService],
    };
  }
}
