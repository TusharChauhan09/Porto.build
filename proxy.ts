import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/arena", "/dashboard", "/editor"];
const authRoutes = ["/auth/signin"];

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

  // Check for session cookie existence
  // better-auth may also chunk the cookie for large tokens
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("better-auth.session_token.0");

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
