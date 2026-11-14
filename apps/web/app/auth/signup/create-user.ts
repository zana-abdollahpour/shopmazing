"use server";

import { redirect } from "next/navigation";

import { post } from "@/common/utils/fetch";
import type { FormResponse } from "@/common/interfaces/form-response";

export async function createUserAction(
  _prevState: FormResponse,
  formData: FormData,
): Promise<FormResponse> {
  const { error } = await post("users", formData);

  if (error) {
    return { error };
  }

  redirect("/");
}
