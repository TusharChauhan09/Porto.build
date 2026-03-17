import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const path = searchParams.get("path") || "/home/user";

  if (!id) {
    return NextResponse.json({ error: "Missing sandbox ID" }, { status: 400 });
  }

  try {
    const sandbox = await getSandbox(id);
    const entries = await sandbox.files.list(path);
    // Filter out node_modules and .next directories
    const filtered = entries.filter(
      (e) => e.name !== "node_modules" && e.name !== ".next"
    );
    return NextResponse.json({ entries: filtered });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list files" },
      { status: 500 }
    );
  }
}
