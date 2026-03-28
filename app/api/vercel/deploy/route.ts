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
      console.log("[vercel-deploy] Reading files from sandbox:", sandboxId);
      try {
        files = await getFilesFromSandbox(sandboxId);
      } catch (e) {
        console.error("[vercel-deploy] Sandbox read failed:", e);
        return NextResponse.json(
          {
            error: "SANDBOX_ERROR",
            message:
              "Could not read files from sandbox. It may have expired — try re-opening the editor.",
          },
          { status: 500 }
        );
      }
      console.log("[vercel-deploy] Got", files.size, "files from sandbox");
      console.log("[vercel-deploy] File paths:", Array.from(files.keys()).join(", "));

      // Ensure page.tsx has PortfolioProps type annotation to prevent build errors
      const pageTsx = files.get("app/page.tsx");
      if (pageTsx && !pageTsx.includes("PortfolioProps")) {
        const patched = pageTsx
          .replace(
            /^(import .+ from .+;\n)/m,
            '$1import type { PortfolioProps } from "./PortfolioTypes";\n'
          )
          .replace(/const data = /,  "const data: PortfolioProps = ");
        files.set("app/page.tsx", patched);
      }

      // Remove lock files to let Vercel install fresh
      files.delete("package-lock.json");
    } else {
      files = await getFilesFromTemplate(templateId, portfolioData!);
    }

    // 3. Create the Vercel deployment
    console.log("[vercel-deploy] Creating Vercel deployment with", files.size, "files");
    const deployment = await createVercelDeployment(
      vercel.token,
      projectName,
      files,
      vercel.teamId
    );
    console.log("[vercel-deploy] Deployment created:", deployment.deploymentId);

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
    console.error("[vercel-deploy] Error:", error);
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
