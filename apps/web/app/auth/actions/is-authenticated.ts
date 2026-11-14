"use server";

import { cookies } from "next/headers";

import { AUTHENTICATION_COOKIE } from "@/app/auth/auth.constants";

export async function isAuthenticated() {
  return !!(await cookies()).get(AUTHENTICATION_COOKIE)?.value;
}
