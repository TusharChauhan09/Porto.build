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
  template2: {
    dir: "portfolio-2",
    component: "Portfolio2.tsx",
    css: "Portfolio2.module.css",
  },
  template3: {
    dir: "portfolio-3",
    component: "Portfolio3.tsx",
    css: "Portfolio3.module.css",
  },
  template4: {
    dir: "portfolio-4",
    component: "Portfolio4.tsx",
    css: "Portfolio4.module.css",
  },
  template5: {
    dir: "portfolio-5",
    component: "Portfolio5.tsx",
    css: "Portfolio5.module.css",
  },
  template6: {
    dir: "portfolio-6",
    component: "Portfolio6.tsx",
    css: "Portfolio6.module.css",
  },
  template7: {
    dir: "portfolio-7",
    component: "Portfolio7.tsx",
    css: "Portfolio7.module.css",
  },
  template8: {
    dir: "portfolio-8",
    component: "Portfolio8.tsx",
    css: "Portfolio8.module.css",
  },
  template9: {
    dir: "portfolio-9",
    component: "Portfolio9.tsx",
    css: "Portfolio9.module.css",
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
