"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTHENTICATION_COOKIE } from "@/app/auth/auth.constants";

export async function logout() {
  (await cookies()).delete(AUTHENTICATION_COOKIE);
  redirect("/auth/login");
}
