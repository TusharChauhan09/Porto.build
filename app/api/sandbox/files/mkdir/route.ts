import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { id, path } = body;

  if (!id || !path) {
    return NextResponse.json({ error: "Missing id or path" }, { status: 400 });
  }

  try {
    const sandbox = await getSandbox(id);
    await sandbox.files.makeDir(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create directory" },
      { status: 500 }
    );
  }
}
