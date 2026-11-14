import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@mui/material";
import "./globals.css";

import Providers from "@/providers";
import Header from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopmazing",
  description: "The greatest e-market ever",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <Container>{children}</Container>
        </Providers>
      </body>
    </html>
  );
}
