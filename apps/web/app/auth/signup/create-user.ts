"use server";

import { redirect } from "next/navigation";

import { post } from "@/utils/fetch";

type SignupState = { error: string };

export async function createUserAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const { error } = await post("users", formData);

  if (error) {
    return { error };
  }

  redirect("/");
}
