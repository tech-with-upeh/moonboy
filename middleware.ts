import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "moonboy_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (pathname === "/login") {
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
