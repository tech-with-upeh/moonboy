import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "moonboy_admin_session";

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function verifyAdminSession(token?: string) {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const separator = token.indexOf(".");
  if (separator <= 0 || separator === token.length - 1) return false;
  const encoded = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, base64UrlToBytes(signature), new TextEncoder().encode(encoded));
    if (!valid) return false;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encoded))) as { adminId?: string; exp?: number };
    return Boolean(payload.adminId && typeof payload.exp === "number" && payload.exp >= Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const validSession = await verifyAdminSession(session);

  if (pathname === "/login") {
    if (validSession) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!validSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/login", "/admin/:path*"] };
