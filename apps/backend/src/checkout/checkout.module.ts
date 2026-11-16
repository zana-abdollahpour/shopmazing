import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { CheckoutController } from './checkout.controller.js';
import { CheckoutService } from './checkout.service.js';

import { ProductsModule } from '@/src/products/products.module.js';

@Module({
  imports: [ConfigModule, ProductsModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY')),
    },
  ],
})
export class CheckoutModule {}
