import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

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

  // Quick pre-check: skip auth call if no session cookie exists
  const sessionCookie = request.cookies.get(
    "better-auth.session_token"
  )?.value;

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Validate session via better-auth
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      isAuthenticated = !!session?.user;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/arena/docs", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
