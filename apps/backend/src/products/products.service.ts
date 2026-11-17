import { join } from 'node:path';
import { promises as fsPromises } from 'node:fs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/src/prisma/prisma.service.js';
import type {
  ProductFindManyArgs,
  ProductUpdateInput,
} from '@/src/generated/prisma/models.js';

import type { CreateProductDto } from '@repo/schemas/products';
import { ProductsGateway } from './products.gateway.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
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

  async uploadProductImage(productId: string, file: Buffer) {
    // TODO: upload to amazon s3
  }

  private async imageExists(productId: number) {
    try {
      await fsPromises.access(
        join(__dirname, '..', '..', `public/products/${productId}.jpg`),
        fsPromises.constants.F_OK,
      );
      return true;
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
