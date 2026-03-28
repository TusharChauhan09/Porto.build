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
  return `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`;
}

function generateGitignore(): string {
  return `node_modules/
.next/
out/
.env
.env.local
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
  files.set("next.config.mjs", generateNextConfig());
  files.set(".gitignore", generateGitignore());
  files.set("README.md", generateReadme(portfolioData.name));

  return files;
}

// ─── File collection: from sandbox ──────────────────────────────────

/**
 * Read all text files from a running sandbox using a single shell command.
 * Runs a script inside the sandbox that finds all text files, reads them,
 * and outputs a JSON map — avoiding hundreds of individual API calls.
 */
export async function getFilesFromSandbox(
  sandboxId: string
): Promise<Map<string, string>> {
  const sandbox = await getSandbox(sandboxId);

  // Write a collector script into the sandbox, then run it.
  // This avoids shell quoting issues with `node -e` and collects all files
  // in a single operation (no per-file API calls).
  const collectorScript = `
const fs = require('fs');
const path = require('path');
const ROOT = '/home/user';

// Only walk directories that contain project source code.
// This avoids .npm cache, .cache, .local, etc. which have thousands of files.
const WALK_DIRS = ['app', 'components', 'lib', 'hooks', 'styles', 'public', 'src'];
const BIN_EXT = new Set(['.png','.jpg','.jpeg','.gif','.ico','.svg','.woff','.woff2','.ttf','.eot','.mp4','.webm','.mp3','.zip','.tar','.gz']);
const MAX_FILE_SIZE = 100 * 1024; // skip files > 100KB

const files = {};

function walk(dir, rel) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) { walk(full, r); }
    else {
      const ext = path.extname(e.name).toLowerCase();
      if (BIN_EXT.has(ext)) continue;
      try {
        const stat = fs.statSync(full);
        if (stat.size > MAX_FILE_SIZE) continue;
        files[r] = fs.readFileSync(full, 'utf-8');
      } catch {}
    }
  }
}

// Walk only known project directories
for (const d of WALK_DIRS) {
  const full = path.join(ROOT, d);
  if (fs.existsSync(full)) walk(full, d);
}

// Collect root-level config files individually
const rootFiles = [
  'package.json', 'tsconfig.json', 'next.config.mjs', 'next.config.ts',
  'tailwind.config.ts', 'tailwind.config.js', 'postcss.config.mjs',
  'postcss.config.js', 'components.json', '.gitignore', 'README.md',
  'next-env.d.ts',
];
for (const f of rootFiles) {
  try { files[f] = fs.readFileSync(path.join(ROOT, f), 'utf-8'); } catch {}
}

process.stdout.write(JSON.stringify(files));
`;

  // Write the script file, run it, then clean up
  await sandbox.files.write("/home/user/_collect.cjs", collectorScript);

  const result = await sandbox.commands.run("node /home/user/_collect.cjs", {
    timeoutMs: 30000,
  });

  // Clean up
  try { await sandbox.files.remove("/home/user/_collect.cjs"); } catch {}

  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to collect sandbox files: ${result.stderr || "script was killed (OOM?)"}`
    );
  }

  if (!result.stdout) {
    throw new Error("Sandbox file collection returned empty output");
  }

  const parsed = JSON.parse(result.stdout) as Record<string, string>;
  // Remove the collector script from results if it got picked up
  delete parsed["_collect.cjs"];

  const files = new Map<string, string>();
  for (const [key, value] of Object.entries(parsed)) {
    files.set(key, value);
  }
  return files;
}
