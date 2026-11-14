"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { FormResponse } from "@/common/interfaces/form-response";
import { API_URL } from "@/constants/api";
import { getErrorMessage } from "@/common/utils/error";
import { AUTHENTICATION_COOKIE } from "@/app/auth/auth.constants";

export async function loginAction(
  _prevState: FormResponse,
  formData: FormData,
) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }

  const setCookieHeader = res.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    (await cookies()).set({
      name: AUTHENTICATION_COOKIE,
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }

  redirect("/");
}
