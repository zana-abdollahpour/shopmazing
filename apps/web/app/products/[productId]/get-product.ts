import { get } from "@/common/utils/fetch";
import { Product } from "@/app/products/interfaces/product.interface";

export async function getProduct(productId: number) {
  return get<Product>(`products/${productId}`);
}
