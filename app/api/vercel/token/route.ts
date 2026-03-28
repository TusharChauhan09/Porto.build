import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const { token } = (await request.json()) as { token: string };

  if (!token || !token.trim()) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 }
    );
  }

  // Verify the token works by calling Vercel's user API
  const verifyRes = await fetch("https://api.vercel.com/v2/user", {
    headers: { Authorization: `Bearer ${token.trim()}` },
  });

  if (!verifyRes.ok) {
    return NextResponse.json(
      {
        error: "INVALID_TOKEN",
        message: "This token is invalid or expired. Please generate a new one.",
      },
      { status: 401 }
    );
  }

  // Store the token
  await prisma.vercelAccount.upsert({
    where: { userId },
    create: {
      userId,
      accessToken: token.trim(),
    },
    update: {
      accessToken: token.trim(),
    },
  });

  return NextResponse.json({ success: true });
}
