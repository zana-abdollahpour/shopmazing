import { NextRequest } from "next/server";

import { isAuthenticated } from "./app/auth/actions/is-authenticated";
import { unauthenticatedRoutes } from "@/constants/routes";

export async function proxy(request: NextRequest) {
  if (
    !(await isAuthenticated()) &&
    !unauthenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route.path),
    )
  ) {
    return Response.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
