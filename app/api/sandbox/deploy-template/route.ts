import { NextRequest, NextResponse } from "next/server";
import { createSandbox, getSandbox } from "@/lib/sandbox";
import { readFileSync } from "fs";
import { join } from "path";
import {
  SANDBOX_TEMPLATE_MAP,
  generateSandboxPageTsx,
} from "@/lib/sandbox-template-utils";
import { generateLayoutTsx, generateGlobalsCss } from "@/lib/github-files";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";
import { requireAuth } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  const userId = auth;

  const body = await request.json();
  const { templateId, portfolioData } = body as {
    templateId: string;
    portfolioData: PortfolioProps;
  };

  if (!templateId || !portfolioData) {
    return NextResponse.json(
      { error: "Missing templateId or portfolioData" },
      { status: 400 }
    );
  }

  const templateInfo = SANDBOX_TEMPLATE_MAP[templateId];
  if (!templateInfo) {
    return NextResponse.json(
      { error: "Unknown template" },
      { status: 400 }
    );
  }

  try {
    // 1. Create sandbox
    const { sandboxId, previewUrl } = await createSandbox(userId);
    const sandbox = await getSandbox(sandboxId);

    // 2. Read template files from disk
    const templateDir = join(process.cwd(), "portfolio-templates");

    const typesContent = readFileSync(
      join(templateDir, "PortfolioTypes.ts"),
      "utf-8"
    );
    const componentContent = readFileSync(
      join(templateDir, templateInfo.dir, templateInfo.component),
      "utf-8"
    );
    const cssContent = readFileSync(
      join(templateDir, templateInfo.dir, templateInfo.css),
      "utf-8"
    );

    // 3. Adapt import paths for flat sandbox structure
    const adaptedComponent = componentContent.replace(
      /from\s+["']\.\.\/PortfolioTypes["']/g,
      'from "./PortfolioTypes"'
    );

    // 4. Generate dynamic files
    const pageTsx = generateSandboxPageTsx(
      templateInfo.component,
      portfolioData
    );
    const layoutTsx = generateLayoutTsx();
    const globalsCss = generateGlobalsCss();

    // 5. Write all files to sandbox in parallel
    await Promise.all([
      sandbox.files.write("/home/user/app/page.tsx", pageTsx),
      sandbox.files.write("/home/user/app/layout.tsx", layoutTsx),
      sandbox.files.write("/home/user/app/globals.css", globalsCss),
      sandbox.files.write(
        `/home/user/app/${templateInfo.component}`,
        adaptedComponent
      ),
      sandbox.files.write(
        `/home/user/app/${templateInfo.css}`,
        cssContent
      ),
      sandbox.files.write("/home/user/app/PortfolioTypes.ts", typesContent),
    ]);

    return NextResponse.json({ sandboxId, previewUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to deploy template to sandbox",
      },
      { status: 500 }
    );
  }
}
