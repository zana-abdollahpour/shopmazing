import { MuiProvider } from "./mui.provider";

export default function Providers({ children }: React.PropsWithChildren) {
  return <MuiProvider>{children}</MuiProvider>;
}
