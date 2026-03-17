import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";

/**
 * GET /api/portfolio?templateId=template1
 * Load the authenticated user's portfolio data for a given template.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const templateId = request.nextUrl.searchParams.get("templateId");
  if (!templateId) {
    return NextResponse.json(
      { error: "Missing templateId" },
      { status: 400 }
    );
  }

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      userId,
      templateId,
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!portfolio) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: portfolio.content, portfolioId: portfolio.id });
}

/**
 * POST /api/portfolio
 * Save the authenticated user's portfolio data for a given template.
 * Creates a new portfolio record if none exists, otherwise updates.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const body = await request.json();
  const { templateId, portfolioData } = body as {
    templateId: string;
    portfolioData: Record<string, unknown>;
  };

  if (!templateId || !portfolioData) {
    return NextResponse.json(
      { error: "Missing templateId or portfolioData" },
      { status: 400 }
    );
  }

  // Find existing portfolio for this user + template
  const existing = await prisma.portfolio.findFirst({
    where: {
      userId,
      templateId,
    },
  });

  let portfolio;
  if (existing) {
    portfolio = await prisma.portfolio.update({
      where: { id: existing.id },
      data: {
        content: portfolioData as object,
        name: (portfolioData.name as string) || existing.name,
      },
    });
  } else {
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        templateId,
        name: (portfolioData.name as string) || "My Portfolio",
        content: portfolioData as object,
        status: "DRAFT",
      },
    });
  }

  return NextResponse.json({ success: true, portfolioId: portfolio.id });
}
