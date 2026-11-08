import { Button, Link, Stack, TextField } from "@mui/material";

import NextLinkClient from "@/components/shared/next-link-client";

export default function LoginPage() {
  return (
    <Stack spacing={2} className="w-full max-w-xs">
      <TextField label="email" variant="outlined" type="email" />
      <TextField label="password" variant="outlined" type="password" />
      <Button variant="contained">Login</Button>

      <Link
        component={NextLinkClient}
        href="/auth/signup"
        className="self-center"
      >
        SignUp
      </Link>
    </Stack>
  );
}
