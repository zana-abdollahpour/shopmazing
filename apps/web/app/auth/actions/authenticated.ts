import { cookies } from "next/headers";

import { AUTHENTICATION_COOKIE } from "@/app/auth/constants";

export async function authenticated() {
  return !!(await cookies()).get(AUTHENTICATION_COOKIE)?.value;
}
