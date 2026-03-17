import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { NextResponse } from "next/server";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

/**
 * Auth guard for API routes. Returns the user ID if authenticated,
 * or a 401 NextResponse if not. Usage:
 *
 *   const auth = await requireAuth();
 *   if (auth instanceof NextResponse) return auth;
 *   const userId = auth;
 */
export async function requireAuth(): Promise<string | NextResponse> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session.user.id;
}
