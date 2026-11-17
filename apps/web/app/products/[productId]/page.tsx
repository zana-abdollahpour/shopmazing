import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Grid from "@mui/material/Grid";

import { getProductImage } from "@/app/products/product-image";
import { getProduct } from "./get-product";
import { Checkout } from "@/app/checkout/checkout";

type SingleProductProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function SingleProductPage({
  params,
}: SingleProductProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const product = await getProduct(+resolvedParams.productId);

  return (
    <Grid container sx={{ marginBottom: "2rem" }} spacing={3}>
      {product.imageExists && (
        <Grid size={{ md: 6, xs: 12 }}>
          <Image
            src={getProductImage(product.id)}
            width={0}
            height={0}
            className="h-auto w-full sm:w-3/4"
            sizes="100vw"
            alt="Picture of the product"
          />
        </Grid>
      )}
      <Grid size={{ md: 6, xs: 12 }}>
        <Stack spacing={3}>
          <Typography variant="h2">{product.name}</Typography>
          <Typography>{product.description}</Typography>
          <Typography variant="h4">${product.price}</Typography>

          <Checkout productId={product.id} />
        </Stack>
      </Grid>
    </Grid>
  );
}
