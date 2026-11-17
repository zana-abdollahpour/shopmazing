import { Module } from '@nestjs/common';

import { PrismaModule } from '@/src/prisma/prisma.module.js';
import { StorageModule } from '@/src/storage/storage.module.js';
import { IamModule } from '@/src/iam/iam.module.js';

import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductsGateway } from './products.gateway.js';

@Module({
  imports: [
    PrismaModule,
    IamModule,
    StorageModule.forFeature({
      region: 'us-east-1',
      bucket: 'shopmazing-products',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsGateway],
  exports: [ProductsService],
})
export class ProductsModule {}
