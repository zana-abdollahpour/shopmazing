import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  productId: z.number(),
});

export type CreateCheckoutSessionDto = z.infer<
  typeof createCheckoutSessionSchema
>;
