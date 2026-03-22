import { readFileSync } from "fs";
import { join } from "path";
import {
  SANDBOX_TEMPLATE_MAP,
  generateSandboxPageTsx,
} from "@/lib/sandbox-template-utils";
import { getSandbox } from "@/lib/sandbox";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

// ─── Shared helpers (also used by deploy-template route) ────────────

export function generateLayoutTsx(): string {
  return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Preview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
}

export function generateGlobalsCss(): string {
  return `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
}

// ─── Scaffolding files for a standalone Next.js project ─────────────

function generatePackageJson(): string {
  return JSON.stringify(
    {
      name: "porto-portfolio",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "16.1.6",
        react: "^19",
        "react-dom": "^19",
      },
      devDependencies: {
        typescript: "^5",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "@types/node": "^20",
      },
    },
    null,
    2
  );
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );
}

function generateNextConfig(): string {
  return `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`;
}

function generateReadme(name: string): string {
  return `# ${name || "My Portfolio"}

Built with [Porto.build](https://porto.build)

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.
`;
}

// ─── File collection: from template ─────────────────────────────────

/**
 * Generate project files from a template + portfolioData (no sandbox needed).
 * Returns a complete standalone Next.js project.
 */
export async function getFilesFromTemplate(
  templateId: string,
  portfolioData: PortfolioProps
): Promise<Map<string, string>> {
  const templateInfo = SANDBOX_TEMPLATE_MAP[templateId];
  if (!templateInfo) throw new Error(`Unknown template: ${templateId}`);

  const files = new Map<string, string>();
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

  const adaptedComponent = componentContent.replace(
    /from\s+["']\.\.\/PortfolioTypes["']/g,
    'from "./PortfolioTypes"'
  );

  const pageTsx = generateSandboxPageTsx(templateInfo.component, portfolioData);

  // App files
  files.set("app/page.tsx", pageTsx);
  files.set("app/layout.tsx", generateLayoutTsx());
  files.set("app/globals.css", generateGlobalsCss());
  files.set(`app/${templateInfo.component}`, adaptedComponent);
  files.set(`app/${templateInfo.css}`, cssContent);
  files.set("app/PortfolioTypes.ts", typesContent);

  // Project scaffolding
  files.set("package.json", generatePackageJson());
  files.set("tsconfig.json", generateTsConfig());
  files.set("next.config.ts", generateNextConfig());
  files.set("README.md", generateReadme(portfolioData.name));

  return files;
}

// ─── File collection: from sandbox ──────────────────────────────────

const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg",
  ".woff", ".woff2", ".ttf", ".eot",
  ".mp4", ".webm", ".mp3",
  ".zip", ".tar", ".gz",
]);

function isBinary(name: string): boolean {
  const lower = name.toLowerCase();
  return Array.from(BINARY_EXTENSIONS).some((ext) => lower.endsWith(ext));
}

/**
 * Read all text files from a running sandbox, recursively.
 * Skips node_modules, .next, .git, and binary files.
 */
export async function getFilesFromSandbox(
  sandboxId: string
): Promise<Map<string, string>> {
  const sandbox = await getSandbox(sandboxId);
  const files = new Map<string, string>();
  await collectFiles(sandbox, "/home/user", "", files);
  return files;
}

async function collectFiles(
  sandbox: Awaited<ReturnType<typeof getSandbox>>,
  basePath: string,
  relativePath: string,
  files: Map<string, string>
): Promise<void> {
  const fullPath = relativePath
    ? `${basePath}/${relativePath}`
    : basePath;

  const entries = await sandbox.files.list(fullPath);

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const entryRelative = relativePath
      ? `${relativePath}/${entry.name}`
      : entry.name;
    const entryFull = `${basePath}/${entryRelative}`;

    if (entry.type === "dir") {
      await collectFiles(sandbox, basePath, entryRelative, files);
    } else {
      if (isBinary(entry.name)) continue;
      try {
        const content = await sandbox.files.read(entryFull);
        files.set(entryRelative, content);
      } catch {
        // Skip files that can't be read as text
      }
    }
  }
}
