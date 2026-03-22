import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/db";
import { isFreeTemplate, getTemplateConfig } from "@/lib/templates";

/**
 * GET /api/purchase?templateId=template2
 * Returns { owned: boolean } for the authenticated user.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const templateId = request.nextUrl.searchParams.get("templateId");
  if (!templateId) {
    return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
  }

  if (isFreeTemplate(templateId)) {
    return NextResponse.json({ owned: true });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { userId_templateId: { userId, templateId } },
  });

  return NextResponse.json({ owned: !!purchase });
}

/**
 * POST /api/purchase
 * Body: { templateId: string }
 * Creates a purchase record (dummy buy — no payment).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const body = await request.json();
  const { templateId } = body as { templateId: string };

  if (!templateId) {
    return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
  }

  const config = getTemplateConfig(templateId);
  if (!config) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  if (isFreeTemplate(templateId)) {
    return NextResponse.json({ error: "Template is free" }, { status: 400 });
  }

  const purchase = await prisma.purchase.upsert({
    where: { userId_templateId: { userId, templateId } },
    update: {},
    create: {
      userId,
      templateId,
      amount: 0,
    },
  });

  return NextResponse.json({ success: true, purchaseId: purchase.id });
}
