import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import {
  getVercelToken,
  createVercelDeployment,
  VercelAuthError,
} from "@/lib/vercel";
import {
  getFilesFromTemplate,
  getFilesFromSandbox,
} from "@/lib/github-files";
import prisma from "@/lib/db";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const body = await request.json();
  const { projectName, templateId, portfolioData, sandboxId, source } =
    body as {
      projectName: string;
      templateId: string;
      portfolioData?: PortfolioProps;
      sandboxId?: string;
      source: "template" | "sandbox";
    };

  if (!projectName || !templateId || !source) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (source === "template" && !portfolioData) {
    return NextResponse.json(
      { error: "portfolioData required for template source" },
      { status: 400 }
    );
  }

  if (source === "sandbox" && !sandboxId) {
    return NextResponse.json(
      { error: "sandboxId required for sandbox source" },
      { status: 400 }
    );
  }

  // 1. Get the user's Vercel access token
  const vercel = await getVercelToken(userId);
  if (!vercel) {
    return NextResponse.json(
      {
        error: "NO_VERCEL_ACCOUNT",
        message:
          "No Vercel account connected. Please connect your Vercel account first.",
      },
      { status: 403 }
    );
  }

  try {
    // 2. Collect files based on source
    let files: Map<string, string>;
    if (source === "sandbox" && sandboxId) {
      files = await getFilesFromSandbox(sandboxId);
    } else {
      files = await getFilesFromTemplate(templateId, portfolioData!);
    }

    // 3. Create the Vercel deployment
    const deployment = await createVercelDeployment(
      vercel.token,
      projectName,
      files,
      vercel.teamId
    );

    // 4. Save deployment info to the portfolio record
    await prisma.portfolio.updateMany({
      where: { userId, templateId },
      data: {
        vercelProjectId: deployment.projectId,
        deploymentUrl: `https://${deployment.url}`,
      },
    });

    return NextResponse.json({
      success: true,
      deploymentId: deployment.deploymentId,
      url: deployment.url,
      projectId: deployment.projectId,
    });
  } catch (error) {
    if (error instanceof VercelAuthError) {
      return NextResponse.json(
        {
          error: "TOKEN_EXPIRED",
          message:
            "Your Vercel connection has expired. Please reconnect your Vercel account.",
        },
        { status: 403 }
      );
    }
    return NextResponse.json(
      {
        error: "DEPLOYMENT_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to deploy to Vercel",
      },
      { status: 500 }
    );
  }
}
