import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number<number>(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
