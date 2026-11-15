"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";

import { Product as IProduct } from "./interfaces/product.interface";
import { getProductImage } from "./product-image";

interface ProductProps {
  product: IProduct;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  return (
    <CardActionArea onClick={() => router.push(`/products/${product.id}`)}>
      <Card className="p-4">
        <Stack spacing={3}>
          <Typography variant="h4">{product.name}</Typography>
          {product.imageExists && (
            <Image
              src={getProductImage(product.id)}
              width="0"
              height="0"
              className="h-auto w-full"
              sizes="100vw"
              alt="Picture of the product"
            />
          )}
          <Typography>{product.description}</Typography>
          <Typography>${product.price}</Typography>
        </Stack>
      </Card>
    </CardActionArea>
  );
}
