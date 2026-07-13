import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE } from "@/lib/auth";

const PUBLIC_PATHS = ["/login"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = session === AUTH_COOKIE_VALUE;

  const isPublic =
    PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    ) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!isAuthed && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthed && pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
