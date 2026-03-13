import { NextResponse } from "next/server";
import { createSandbox } from "@/lib/sandbox";

export async function POST() {
  try {
    const result = await createSandbox();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create sandbox" },
      { status: 500 }
    );
  }
}
