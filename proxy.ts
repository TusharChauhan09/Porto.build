import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/arena", "/dashboard", "/editor"];
const authRoutes = ["/auth/signin"];

/**
 * Check if a better-auth session cookie exists.
 * In production (HTTPS), better-auth prefixes cookies with "__Secure-".
 * We check all possible variants including chunked cookies.
 */
function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  const names = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    // chunked variants for large tokens
    "better-auth.session_token.0",
    "__Secure-better-auth.session_token.0",
  ];
  return names.some((name) => cookies.has(name));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const hasSession = hasSessionCookie(request);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/arena/docs", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
