import { get } from "@/common/utils/fetch";

export async function getMe() {
  return get("users/me");
}
