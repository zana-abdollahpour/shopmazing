"use client";

import { useActionState } from "react";
import { Button, Link, Stack, TextField } from "@mui/material";

import NextLinkClient from "@/components/shared/next-link-client";
import { createUserAction } from "@/app/auth/signup/create-user";

const initialState = { error: "" };

export default function SignupPage() {
  const [state, formAction] = useActionState(createUserAction, initialState);

  return (
    <form action={formAction} className="w-full max-w-xs">
      <Stack spacing={2}>
        <TextField
          label="email"
          name="email"
          variant="outlined"
          helperText={state.error}
          error={!!state.error}
        />
        <TextField
          label="password"
          name="password"
          variant="outlined"
          type="password"
          helperText={state.error}
          error={!!state.error}
        />

        <Button type="submit" variant="contained">
          Signup
        </Button>

        <Link
          component={NextLinkClient}
          href="/auth/login"
          className="self-center"
        >
          LogIn
        </Link>
      </Stack>
    </form>
  );
}
