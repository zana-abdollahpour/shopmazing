import { createContext, useContext } from "react";

import { isAuthenticated } from "@/app/auth/actions/is-authenticated";

const AuthContext = createContext(false);

export async function AuthProvider({ children }: React.PropsWithChildren) {
  const isUserAuthenticated = await isAuthenticated();
  return <AuthContext value={isUserAuthenticated}>{children}</AuthContext>;
}

export const useAuth = () => {
  const isAuthenticated = useContext(AuthContext);
  return isAuthenticated;
};
