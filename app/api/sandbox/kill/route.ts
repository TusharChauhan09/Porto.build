import { NextRequest, NextResponse } from "next/server";
import { killSandbox, getSandboxOwner } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const { sandboxId } = await request.json();
  if (!sandboxId) {
    return NextResponse.json({ error: "Missing sandboxId" }, { status: 400 });
  }

  // Ownership check: only the creator can kill their sandbox
  const owner = getSandboxOwner(sandboxId);
  if (owner && owner !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await killSandbox(sandboxId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to kill sandbox" },
      { status: 500 }
    );
  }
}
