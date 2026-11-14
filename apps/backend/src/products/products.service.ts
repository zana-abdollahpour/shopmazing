import { Injectable } from '@nestjs/common';

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
}
