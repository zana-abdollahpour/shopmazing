"use server";

import { redirect } from "next/navigation";

import { API_URL } from "@/constants/api";
import { getErrorMessage } from "@/utils/error";

type SignupState = { error: string };

export async function createUserAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  let errorMessage = "";

  try {
    const rawRes = await fetch(`${API_URL}/users`, {
      method: "POST",
      body: formData,
    });

    if (!rawRes.ok) {
      let message = `Signup failed (${rawRes.status})`;
      try {
        const body = await rawRes.json();
        if (body?.message) message = body.message;
      } catch {}
      errorMessage = message;
    }
  } catch (err) {
    console.error(err);
    errorMessage = "Something went wrong. Please try again.";
  }

  if (errorMessage) {
    return { error: getErrorMessage(errorMessage) };
  }

  redirect("/");
}
