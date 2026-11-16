import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import Stripe from 'stripe';

import {
  createCheckoutSessionSchema,
  type CreateCheckoutSessionDto,
} from '@repo/schemas/checkout';

import { JwtAuthenticationGuard } from '@/src/iam/authentication/guards/jwt-authentication.guard.js';
import { CheckoutService } from './checkout.service.js';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createSession(
    @Body({ schema: createCheckoutSessionSchema })
    dto: CreateCheckoutSessionDto,
  ): Promise<Stripe.Checkout.Session> {
    return this.checkoutService.createCheckoutSession(dto.productId);
  }
}
