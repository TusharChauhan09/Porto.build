import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const filePath = searchParams.get("path");

  if (!id || !filePath) {
    return NextResponse.json({ error: "Missing id or path" }, { status: 400 });
  }

  try {
    const sandbox = await getSandbox(id);
    const content = await sandbox.files.read(filePath);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read file" },
      { status: 500 }
    );
  }
}
