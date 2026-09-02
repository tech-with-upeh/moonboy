import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const VISITOR_COOKIE = "moonboy_visitor";

export function getVisitorId(): string {
  const cookieStore = cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  return randomUUID();
}
