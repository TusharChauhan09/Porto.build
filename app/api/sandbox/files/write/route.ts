import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, path, content } = body;

  if (!id || !path || content === undefined) {
    return NextResponse.json({ error: "Missing id, path, or content" }, { status: 400 });
  }

  try {
    const sandbox = await getSandbox(id);
    await sandbox.files.write(path, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to write file" },
      { status: 500 }
    );
  }
}
