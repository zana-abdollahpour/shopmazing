import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import {
  createProductSchema,
  type CreateProductDto,
} from '@repo/schemas/products';

import { JwtAuthenticationGuard } from '@/src/iam/authentication/guards/jwt-authentication.guard.js';
import { CurrentUser } from '@/src/iam/authentication/decorators/current-user.decorator.js';
import type { TokenPayload } from '@/src/iam/interfaces/token-payload.interface.js';
import { ProductsService } from '@/src/products/products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(
    @Body({ schema: createProductSchema }) dto: CreateProductDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(dto, user.userId);
  }
}
