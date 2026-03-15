"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { BrowserPreview } from "@/components/browser-preview";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

// Template registry — form + preview components
import Portfolio1Form from "@/portfolio-templates/portfolio-1/Portfolio1Form";
import Portfolio1 from "@/portfolio-templates/portfolio-1/Portfolio1";

const TEMPLATE_REGISTRY: Record<
  string,
  {
    name: string;
    Form: React.ComponentType<{ initialData?: Partial<PortfolioProps>; onChange: (data: PortfolioProps) => void }>;
    Preview: React.ComponentType<PortfolioProps>;
  }
> = {
  template1: { name: "Brutalist", Form: Portfolio1Form, Preview: Portfolio1 },
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

const DEFAULT_DATA: PortfolioProps = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "Write something about yourself here. This will appear in the About section of your portfolio.",
  image: "https://placehold.co/400x400/0a0a0b/a413ec?text=You",
  location: "Your City",
  resumeUrl: "",
  socials: [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
  skills: [
    { name: "TypeScript / React", percentage: 90 },
    { name: "Node.js", percentage: 85 },
    { name: "PostgreSQL", percentage: 75 },
  ],
  projects: [
    {
      title: "Project One",
      description: "A brief description of your first project.",
      tags: ["React", "TypeScript"],
      liveUrl: "",
      repoUrl: "",
    },
  ],
  certifications: [
    { title: "Example Certification", issuer: "Issuing Org", date: "2024" },
  ],
  education: [
    {
      institution: "University",
      degree: "BSc",
      field: "Computer Science",
      startDate: "2018",
      endDate: "2022",
    },
  ],
  experience: [
    {
      company: "Company",
      role: "Developer",
      startDate: "2022",
      endDate: "",
      description: "What you did at this role.",
      current: true,
    },
  ],
};

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

  const handleChange = useCallback((data: PortfolioProps) => {
    setPortfolioData(data);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveData(templateId, portfolioData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [templateId, portfolioData]);

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
        <button
          onClick={handleSave}
          className="flex items-center gap-2 pl-2 pr-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Save size={14} strokeWidth={1.5} />
          <span className="italic-main font-bold">{saved ? "Saved!" : "Save"}</span>
        </button>
      </div>

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
