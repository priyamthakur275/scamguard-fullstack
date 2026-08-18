import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/analyze", "/history", "/analytics", "/settings"];
const AUTH_PAGES = ["/login", "/register"];
const SESSION_FLAG_COOKIE = "has_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionFlag = request.cookies.get(SESSION_FLAG_COOKIE)?.value === "1";

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);

  if (isProtectedRoute && !hasSessionFlag) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && hasSessionFlag) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analyze/:path*", "/history/:path*", "/analytics/:path*", "/settings/:path*", "/login", "/register"],
};
