import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";

/**
 * GET /api/purchase/all
 * Returns all templateIds the authenticated user has purchased.
 */
export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    select: { templateId: true },
  });

  const ownedTemplateIds = purchases.map((p) => p.templateId);
  return NextResponse.json({ ownedTemplateIds });
}
