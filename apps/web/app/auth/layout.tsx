import { Box } from "@mui/material";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Box className="flex h-dvh items-center justify-center">{children}</Box>
  );
}
