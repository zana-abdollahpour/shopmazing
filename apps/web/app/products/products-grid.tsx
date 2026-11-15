"use client";

import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Socket, io } from "socket.io-client";

import Product from "./product";
import { revalidateProducts } from "./actions/revalidate-products";
import type { Product as IProduct } from "./interfaces/product.interface";

import { API_URL } from "@/constants/api";
import { getAuthentication } from "@/app/auth/actions/get-authentication";

interface ProductGridProps {
  products: IProduct[];
}

export function ProductsGrid({ products }: ProductGridProps) {
  useEffect(() => {
    let socket: Socket;

    const createSocket = async () => {
      socket = io(API_URL!, {
        auth: {
          Authentication: await getAuthentication(),
        },
      });

      socket.on("productUpdated", () => {
        revalidateProducts();
      });
    };

    createSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <Grid container spacing={3} sx={{ height: "85vh", overflow: "scroll" }}>
      {products?.map((product) => (
        <Grid key={product.id} size={{ sm: 6, lg: 4, xs: 12 }}>
          <Product product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
