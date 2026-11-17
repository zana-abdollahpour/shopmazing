import { join } from 'node:path';
import { promises as fsPromises } from 'node:fs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/src/prisma/prisma.service.js';
import type {
  ProductFindManyArgs,
  ProductUpdateInput,
} from '@/src/generated/prisma/models.js';

import { StorageService } from '@/src/storage/storage-provider/storage.service.abstract.js';
import type { CreateProductDto } from '@repo/schemas/products';

import { ProductsGateway } from './products.gateway.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
    private readonly storageService: StorageService,
  ) {}

  async createProduct(dto: CreateProductDto, userId: number) {
    const product = await this.prismaService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        userId: userId,
      },
    });

    this.productsGateway.handleProductUpdated();
    return product;
  }

  async update(productId: number, data: ProductUpdateInput) {
    await this.prismaService.product.update({
      where: { id: productId },
      data,
    });

    this.productsGateway.handleProductUpdated();
  }

  async getProducts(status?: string) {
    const findArgs: ProductFindManyArgs = {};
    if (status === 'available') {
      findArgs.where = { sold: false };
    }

    const products = await this.prismaService.product.findMany(findArgs);
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async uploadProductImage(productId: number, file: Buffer) {
    this.storageService.upload(productId, file);
  }

  private async imageExists(productId: number) {
    try {
      const exists = await this.storageService.fileExists(`${productId}.jpg`);
      return exists;
    } catch (err) {
      return false;
    }
  }

  async getProduct(productId: number) {
    try {
      const row = await this.prismaService.product.findUniqueOrThrow({
        where: { id: productId },
      });
      const imageExists = await this.imageExists(productId);

      return { ...row, imageExists };
    } catch (error) {
      throw new NotFoundException(`Product not found with Id ${productId}`);
    }
  }
}
