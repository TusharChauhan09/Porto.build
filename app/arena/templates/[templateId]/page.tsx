"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BrowserPreview } from "@/components/browser-preview";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";
import { DEFAULT_PORTFOLIO_DATA } from "@/lib/default-portfolio-data";
import { useSession } from "@/lib/auth-client";

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

/** Build a user-scoped localStorage key */
function storageKey(userId: string, templateId: string): string {
  return `${STORAGE_PREFIX}${userId}_${templateId}`;
}

function loadSavedData(userId: string, templateId: string): Partial<PortfolioProps> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(storageKey(userId, templateId));
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveDataLocal(userId: string, templateId: string, data: PortfolioProps) {
  try {
    localStorage.setItem(storageKey(userId, templateId), JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

const DEFAULT_DATA = DEFAULT_PORTFOLIO_DATA;

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const templateId = params.templateId as string;
  const userId = session?.user?.id;

  const entry = TEMPLATE_REGISTRY[templateId];

  const [portfolioData, setPortfolioData] = useState<PortfolioProps>(DEFAULT_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);
  // Bump this to force the Form component to remount with fresh initialData
  const [formKey, setFormKey] = useState(0);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  // Fetch portfolio data from the server and update state + form
  const fetchFromServer = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/portfolio?templateId=${encodeURIComponent(templateId)}`);
      const json = await res.json();
      if (json.data) {
        const serverData = json.data as Partial<PortfolioProps>;
        const merged = { ...DEFAULT_DATA, ...serverData };
        setPortfolioData(merged);
        saveDataLocal(userId, templateId, merged);
        // Force form remount so it picks up the new data
        setFormKey((k) => k + 1);
      }
    } catch {
      // Server unavailable — localStorage data is fine as fallback
    }
  }, [userId, templateId]);

  // Load user-scoped data on mount: first from localStorage, then from server
  useEffect(() => {
    if (sessionLoading || !userId) return;

    // 1. Immediately load from user-scoped localStorage
    const localData = loadSavedData(userId, templateId);
    if (localData) {
      setPortfolioData({ ...DEFAULT_DATA, ...localData });
    }

    // 2. Then fetch from server (source of truth) and merge
    fetchFromServer().finally(() => setDataLoaded(true));
  }, [userId, sessionLoading, templateId, fetchFromServer]);

  // Re-fetch from server when user navigates back to this page (e.g. from sandbox editor)
  useEffect(() => {
    if (!userId) return;

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchFromServer();
      }
    }

    // popstate fires when user navigates back via browser history
    function handlePopState() {
      fetchFromServer();
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);
    // Also re-fetch on window focus (covers Alt+Tab back, etc.)
    window.addEventListener("focus", fetchFromServer);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("focus", fetchFromServer);
    };
  }, [userId, fetchFromServer]);

  // Also mark loaded if no session (shouldn't happen in /arena, but be safe)
  useEffect(() => {
    if (!sessionLoading && !userId) {
      setDataLoaded(true);
    }
  }, [sessionLoading, userId]);

  const handleChange = useCallback((data: PortfolioProps) => {
    setPortfolioData(data);
  }, []);

  const handleSave = useCallback(async () => {
    if (!userId) return;

    // Save to user-scoped localStorage immediately
    saveDataLocal(userId, templateId, portfolioData);

    // Persist to server
    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, portfolioData }),
      });
      toast.success("Portfolio saved");
    } catch {
      toast.error("Server save failed", { description: "Changes saved locally as backup" });
    }
  }, [userId, templateId, portfolioData]);

  const handleLaunchSandbox = useCallback(async () => {
    setSandboxLoading(true);

    // Save data before launching sandbox
    if (userId) {
      saveDataLocal(userId, templateId, portfolioData);
      try {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId, portfolioData }),
        });
      } catch {
        // Continue with sandbox launch even if server save fails
      }
    }

    try {
      const res = await fetch("/api/sandbox/deploy-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, portfolioData }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error("Sandbox launch failed", { description: data.error });
        return;
      }
      toast.success("Sandbox ready");
      // Navigate to the code editor with the sandbox already running
      router.push(
        `/editor?sandboxId=${encodeURIComponent(data.sandboxId)}&previewUrl=${encodeURIComponent(data.previewUrl)}&templateId=${encodeURIComponent(templateId)}`
      );
    } catch {
      toast.error("Failed to launch sandbox");
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

  // Show loading state while session or data is being fetched
  if (sessionLoading || !dataLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading your portfolio...</span>
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
            <span className="italic-main font-bold">Save</span>
          </button>
        </div>
      </div>

      {/* Form + Preview split */}
      <div className="flex flex-1 min-h-0">
        {/* Form panel — vertical scroll only */}
        <div className="w-[480px] flex-shrink-0 border-r border-border overflow-y-auto overflow-x-hidden bg-background">
          <Form key={formKey} initialData={portfolioData} onChange={handleChange} />
        </div>

        {/* Live preview */}
        <BrowserPreview url={`portfolio.porto.build/${portfolioData.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Preview {...portfolioData} />
        </BrowserPreview>
      </div>
    </div>
  );
}

