import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

/**
 * Maps templateId to file metadata needed for sandbox deployment.
 */
export const SANDBOX_TEMPLATE_MAP: Record<
  string,
  { dir: string; component: string; css: string }
> = {
  template1: {
    dir: "portfolio-1",
    component: "Portfolio1.tsx",
    css: "Portfolio1.module.css",
  },
};

/**
 * Generates the page.tsx source for the sandbox.
 * Imports the template component and renders it with the user's data as props.
 * Safe to call from both client and server (pure string generation).
 */
export function generateSandboxPageTsx(
  componentFileName: string,
  portfolioData: PortfolioProps
): string {
  const importName = componentFileName.replace(".tsx", "");
  return `import ${importName} from "./${importName}";

const data = ${JSON.stringify(portfolioData, null, 2)};

export default function Page() {
  return <${importName} {...data} />;
}
`;
}
