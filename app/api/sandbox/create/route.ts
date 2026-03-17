import { NextResponse } from "next/server";
import { createSandbox } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

export async function POST() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  try {
    const result = await createSandbox(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create sandbox" },
      { status: 500 }
    );
  }
}
