"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Loader2 } from "lucide-react";
import { BrowserPreview } from "@/components/browser-preview";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";
import { DEFAULT_PORTFOLIO_DATA } from "@/lib/default-portfolio-data";

// Template registry — form + preview components
import Portfolio1Form from "@/portfolio-templates/portfolio-1/Portfolio1Form";
import Portfolio1 from "@/portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2Form from "@/portfolio-templates/portfolio-2/Portfolio2Form";
import Portfolio2 from "@/portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3Form from "@/portfolio-templates/portfolio-3/Portfolio3Form";
import Portfolio3 from "@/portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4Form from "@/portfolio-templates/portfolio-4/Portfolio4Form";
import Portfolio4 from "@/portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5Form from "@/portfolio-templates/portfolio-5/Portfolio5Form";
import Portfolio5 from "@/portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6Form from "@/portfolio-templates/portfolio-6/Portfolio6Form";
import Portfolio6 from "@/portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7Form from "@/portfolio-templates/portfolio-7/Portfolio7Form";
import Portfolio7 from "@/portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8Form from "@/portfolio-templates/portfolio-8/Portfolio8Form";
import Portfolio8 from "@/portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9Form from "@/portfolio-templates/portfolio-9/Portfolio9Form";
import Portfolio9 from "@/portfolio-templates/portfolio-9/Portfolio9";

const TEMPLATE_REGISTRY: Record<
  string,
  {
    name: string;
    Form: React.ComponentType<{ initialData?: Partial<PortfolioProps>; onChange: (data: PortfolioProps) => void }>;
    Preview: React.ComponentType<PortfolioProps>;
  }
> = {
  template1: { name: "Brutalist", Form: Portfolio1Form, Preview: Portfolio1 },
  template2: { name: "Cyberpunk", Form: Portfolio2Form, Preview: Portfolio2 },
  template3: { name: "Designer", Form: Portfolio3Form, Preview: Portfolio3 },
  template4: { name: "Minimal", Form: Portfolio4Form, Preview: Portfolio4 },
  template5: { name: "Creative", Form: Portfolio5Form, Preview: Portfolio5 },
  template6: { name: "Professional", Form: Portfolio6Form, Preview: Portfolio6 },
  template7: { name: "Terminal", Form: Portfolio7Form, Preview: Portfolio7 },
  template8: { name: "Bold", Form: Portfolio8Form, Preview: Portfolio8 },
  template9: { name: "Luxury", Form: Portfolio9Form, Preview: Portfolio9 },
};

const STORAGE_PREFIX = "porto_template_";

function loadSavedData(templateId: string): Partial<PortfolioProps> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${templateId}`);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveData(templateId: string, data: PortfolioProps) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${templateId}`, JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

const DEFAULT_DATA = DEFAULT_PORTFOLIO_DATA;

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const entry = TEMPLATE_REGISTRY[templateId];

  const [portfolioData, setPortfolioData] = useState<PortfolioProps>(() => {
    const saved = loadSavedData(templateId);
    return { ...DEFAULT_DATA, ...saved };
  });

  const [saved, setSaved] = useState(false);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const handleChange = useCallback((data: PortfolioProps) => {
    setPortfolioData(data);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveData(templateId, portfolioData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [templateId, portfolioData]);

  const handleLaunchSandbox = useCallback(async () => {
    setSandboxLoading(true);
    setSandboxError(null);
    try {
      const res = await fetch("/api/sandbox/deploy-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, portfolioData }),
      });
      const data = await res.json();
      if (data.error) {
        setSandboxError(data.error);
        return;
      }
      // Navigate to the code editor with the sandbox already running
      router.push(
        `/editor?sandboxId=${encodeURIComponent(data.sandboxId)}&previewUrl=${encodeURIComponent(data.previewUrl)}`
      );
    } catch {
      setSandboxError("Failed to launch sandbox");
    } finally {
      setSandboxLoading(false);
    }
  }, [templateId, portfolioData, router]);

  if (!entry) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Template not found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This template is not available yet.
          </p>
          <button
            onClick={() => router.push("/arena/templates")}
            className="text-sm text-primary underline"
          >
            Back to templates
          </button>
        </div>
      </div>
    );
  }

  const { name, Form, Preview } = entry;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/arena/templates")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <h1 className="text-sm font-semibold tracking-tight">{name}</h1>
          <span className="text-[10px] text-muted-foreground font-mono uppercase">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Sandbox button */}
          <button
            onClick={handleLaunchSandbox}
            disabled={sandboxLoading}
            className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {sandboxLoading ? (
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Play size={14} strokeWidth={1.5} />
            )}
            <span>{sandboxLoading ? "Launching..." : "Sandbox"}</span>
          </button>
          {/* Save button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 pl-2 pr-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={14} strokeWidth={1.5} />
            <span className="italic-main font-bold">{saved ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Sandbox error bar */}
      {sandboxError && (
        <div className="px-4 py-1.5 bg-destructive/10 text-destructive text-xs border-b border-destructive/20 flex items-center justify-between">
          <span>{sandboxError}</span>
          <button
            onClick={() => setSandboxError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form + Preview split */}
      <div className="flex flex-1 min-h-0">
        {/* Form panel — vertical scroll only */}
        <div className="w-[480px] flex-shrink-0 border-r border-border overflow-y-auto overflow-x-hidden bg-background">
          <Form initialData={portfolioData} onChange={handleChange} />
        </div>

        {/* Live preview */}
        <BrowserPreview url={`portfolio.porto.build/${portfolioData.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Preview {...portfolioData} />
        </BrowserPreview>
      </div>
    </div>
  );
}
