import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-session";
import {
  getGitHubToken,
  createGitHubRepo,
  pushFilesToRepo,
} from "@/lib/github";
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
  const { repoName, isPrivate, templateId, portfolioData, sandboxId, source } =
    body as {
      repoName: string;
      isPrivate: boolean;
      templateId: string;
      portfolioData?: PortfolioProps;
      sandboxId?: string;
      source: "template" | "sandbox";
    };

  if (!repoName || !templateId || !source) {
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

  // 1. Get the user's GitHub access token
  const token = await getGitHubToken(userId);
  if (!token) {
    return NextResponse.json(
      {
        error: "NO_GITHUB_ACCOUNT",
        message: "No GitHub account linked. Please sign in with GitHub first.",
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

    // 3. Create the GitHub repo
    let repoInfo: { owner: string; repo: string; url: string };
    try {
      repoInfo = await createGitHubRepo(token, repoName, isPrivate ?? false);
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 422) {
        return NextResponse.json(
          {
            error: "REPO_EXISTS",
            message: `Repository "${repoName}" already exists on your GitHub.`,
          },
          { status: 409 }
        );
      }
      if (status === 401 || status === 403 || status === 404) {
        return NextResponse.json(
          {
            error: "INSUFFICIENT_SCOPE",
            message:
              "Your GitHub token doesn't have permission to create repos. Please re-authenticate with GitHub.",
          },
          { status: 403 }
        );
      }
      throw err;
    }

    // 4. Push all files to the repo in a single commit
    await pushFilesToRepo(
      token,
      repoInfo.owner,
      repoInfo.repo,
      files,
      "Initial portfolio deployment from Porto.build"
    );

    // 5. Save the GitHub repo URL to the portfolio record
    await prisma.portfolio.updateMany({
      where: { userId, templateId },
      data: { deploymentUrl: repoInfo.url },
    });

    return NextResponse.json({
      success: true,
      repoUrl: repoInfo.url,
      owner: repoInfo.owner,
      repo: repoInfo.repo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "UPLOAD_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload to GitHub",
      },
      { status: 500 }
    );
  }
}
