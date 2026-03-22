import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // original page URL to return to

  if (!code) {
    const returnUrl = state ? decodeURIComponent(state) : "/arena/templates";
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      "https://api.vercel.com/v2/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.VERCEL_CLIENT_ID!,
          client_secret: process.env.VERCEL_CLIENT_SECRET!,
          code,
          redirect_uri: `${process.env.BETTER_AUTH_URL}/api/vercel/callback`,
        }),
      }
    );

    if (!tokenRes.ok) {
      const returnUrl = state ? decodeURIComponent(state) : "/arena/templates";
      return NextResponse.redirect(
        new URL(`${returnUrl}?vercel_error=auth_failed`, request.url)
      );
    }

    const tokenData = await tokenRes.json();

    // Upsert VercelAccount
    await prisma.vercelAccount.upsert({
      where: { userId },
      create: {
        userId,
        accessToken: tokenData.access_token,
        teamId: tokenData.team_id || null,
      },
      update: {
        accessToken: tokenData.access_token,
        teamId: tokenData.team_id || null,
      },
    });

    // Redirect back to the page the user was on
    const returnUrl = state ? decodeURIComponent(state) : "/arena/templates";
    return NextResponse.redirect(new URL(returnUrl, request.url));
  } catch {
    const returnUrl = state ? decodeURIComponent(state) : "/arena/templates";
    return NextResponse.redirect(
      new URL(`${returnUrl}?vercel_error=auth_failed`, request.url)
    );
  }
}
