"use client";
import NextLink from "next/link";

export default function LinkBehavior({
  ref,
  children,
  ...props
}: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink ref={ref} {...props}>
      {children}
    </NextLink>
  );
}
