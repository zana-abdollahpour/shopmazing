"use server";

import { get } from "@/common/utils/fetch";
import { Product } from "@/app/products/interfaces/product.interface";

export async function getProducts() {
  return get<Product[]>(
    "products",
    ["products"],
    new URLSearchParams({ status: "available" }),
  );
}
