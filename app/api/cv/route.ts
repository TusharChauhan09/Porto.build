import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";

/**
 * GET /api/cv
 * Load the authenticated user's CV data.
 */
export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const cv = await prisma.cv.findFirst({
    where: { userId, portfolioId: null },
    orderBy: { updatedAt: "desc" },
  });

  if (!cv) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: cv.content, cvId: cv.id });
}

/**
 * POST /api/cv
 * Save the authenticated user's CV data (upsert).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const body = await request.json();
  const { cvData } = body as { cvData: Record<string, unknown> };

  if (!cvData) {
    return NextResponse.json({ error: "Missing cvData" }, { status: 400 });
  }

  const existing = await prisma.cv.findFirst({
    where: { userId, portfolioId: null },
  });

  const personalInfo = cvData.personalInfo as
    | { fullName?: string }
    | undefined;
  const nameFromData = personalInfo?.fullName;

  let cv;
  if (existing) {
    cv = await prisma.cv.update({
      where: { id: existing.id },
      data: {
        content: cvData as object,
        title: nameFromData ? `${nameFromData}'s CV` : existing.title,
      },
    });
  } else {
    cv = await prisma.cv.create({
      data: {
        userId,
        title: nameFromData ? `${nameFromData}'s CV` : "My CV",
        content: cvData as object,
      },
    });
  }

  return NextResponse.json({ success: true, cvId: cv.id });
}
