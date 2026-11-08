import { Button, Link, Stack, TextField } from "@mui/material";

import NextLinkClient from "@/components/shared/next-link-client";

export default function SignupPage() {
  return (
    <Stack spacing={2} className="w-full max-w-xs">
      <TextField label="email" variant="outlined" type="email" />
      <TextField label="password" variant="outlined" type="password" />
      <Button variant="contained">Signup</Button>

      <Link
        component={NextLinkClient}
        href="/auth/login"
        className="self-center"
      >
        LogIn
      </Link>
    </Stack>
  );
}
