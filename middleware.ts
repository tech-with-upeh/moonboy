import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "moonboy_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page must always remain reachable; otherwise /admin/login
  // redirects to itself through the protected admin layout.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
