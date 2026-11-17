"use server";

import { post } from "@/common/utils/fetch";

export async function checkout(productId: number) {
  return post("checkout/session", { productId });
}
