import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@mui/material";
import "./globals.css";

import Providers from "@/providers";
import Header from "@/common/components/layout/header";
import { isAuthenticated } from "@/app/auth/actions/is-authenticated";

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
  const isUserAuthenticated = await isAuthenticated();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <Container className={isUserAuthenticated ? "mt-10" : ""}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
