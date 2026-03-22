import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import {
  getVercelToken,
  getDeploymentStatus,
  VercelAuthError,
} from "@/lib/vercel";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const { searchParams } = new URL(request.url);

  // Check if user has a Vercel connection
  if (searchParams.get("check") === "connection") {
    const vercel = await getVercelToken(userId);
    return NextResponse.json({ connected: !!vercel });
  }

  // Poll deployment status
  const deploymentId = searchParams.get("deploymentId");
  if (!deploymentId) {
    return NextResponse.json(
      { error: "deploymentId is required" },
      { status: 400 }
    );
  }

  const vercel = await getVercelToken(userId);
  if (!vercel) {
    return NextResponse.json(
      { error: "NO_VERCEL_ACCOUNT", message: "No Vercel account connected." },
      { status: 403 }
    );
  }

  try {
    const status = await getDeploymentStatus(
      vercel.token,
      deploymentId,
      vercel.teamId
    );
    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof VercelAuthError) {
      return NextResponse.json(
        { error: "TOKEN_EXPIRED", message: "Vercel connection expired." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      {
        error: "STATUS_CHECK_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to check deployment status",
      },
      { status: 500 }
    );
  }
}
