import { join } from 'node:path';
import { promises as fsPromises } from 'node:fs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/src/prisma/prisma.service.js';
import type { CreateProductDto } from '@repo/schemas/products';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(dto: CreateProductDto, userId: number) {
    return this.prismaService.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        userId: userId,
      },
    });
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany();
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
