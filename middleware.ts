import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "moonboy_admin_session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
