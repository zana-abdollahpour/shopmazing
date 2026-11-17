import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  createProductSchema,
  type CreateProductDto,
} from '@repo/schemas/products';

import { JwtAuthenticationGuard } from '@/src/iam/authentication/guards/jwt-authentication.guard.js';
import { CurrentUser } from '@/src/iam/authentication/decorators/current-user.decorator.js';
import type { TokenPayload } from '@/src/iam/interfaces/token-payload.interface.js';
import { ProductsService } from '@/src/products/products.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':productId/image')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productId') productId: string,
  ) {
    return this.productsService.uploadProductImage(productId, file.buffer);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getProducts(@Query('status') status?: string) {
    return this.productsService.getProducts(status);
  }

  @Get(':productId')
  @UseGuards(JwtAuthenticationGuard)
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }
}
