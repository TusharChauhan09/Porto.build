import { NextRequest, NextResponse } from "next/server";
import { getSandbox } from "@/lib/sandbox";
import { requireAuth } from "@/lib/auth-session";

/**
 * POST /api/sandbox/extract-data
 * Reads page.tsx from the sandbox and extracts the portfolio data JSON.
 *
 * The sandbox page.tsx has this shape:
 *   const data = { ... JSON ... };
 *
 * We extract the JSON between `const data = ` and the closing `};`
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { sandboxId } = await request.json();
  if (!sandboxId) {
    return NextResponse.json({ error: "Missing sandboxId" }, { status: 400 });
  }

  try {
    const sandbox = await getSandbox(sandboxId);
    const pageTsx = await sandbox.files.read("/home/user/app/page.tsx");

    // Extract the JSON from: const data = { ... };
    const match = pageTsx.match(/const data = (\{[\s\S]*?\});/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: "Could not extract data from page.tsx" }, { status: 400 });
    }

    // Parse the extracted JSON
    const portfolioData = JSON.parse(match[1]);

    return NextResponse.json({ portfolioData });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract data" },
      { status: 500 }
    );
  }
}
