"use client";

import { useFormState } from "react-dom";
import { Button, Link, Stack, TextField } from "@mui/material";

import NextLinkClient from "@/components/shared/next-link-client";
import { loginAction } from "@/app/auth/login/login";

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, { error: "" });

  return (
    <form className="w-full max-w-xs" action={formAction}>
      <Stack spacing={2}>
        <TextField
          name="email"
          label="email"
          variant="outlined"
          type="email"
          error={!!state.error}
          helperText={state.error}
        />
        <TextField
          name="password"
          label="password"
          variant="outlined"
          type="password"
          error={!!state.error}
          helperText={state.error}
        />
        <Button type="submit" variant="contained">
          Login
        </Button>

        <Link
          component={NextLinkClient}
          href="/auth/signup"
          className="self-center"
        >
          SignUp
        </Link>
      </Stack>
    </form>
  );
}
