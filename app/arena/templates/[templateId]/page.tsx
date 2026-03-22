"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Loader2, Lock, ShoppingCart, Github } from "lucide-react";
import { toast } from "sonner";
import { BrowserPreview } from "@/components/browser-preview";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";
import { DEFAULT_PORTFOLIO_DATA } from "@/lib/default-portfolio-data";
import { useSession } from "@/lib/auth-client";
import { isFreeTemplate, getTemplateConfig, getDiscountedPrice } from "@/lib/templates";
import { GitHubUploadDialog } from "@/components/GitHubUploadDialog";
import { VercelDeployDialog } from "@/components/VercelDeployDialog";

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
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [showGitHubDialog, setShowGitHubDialog] = useState(false);
  const [showVercelDialog, setShowVercelDialog] = useState(false);
  const templateConfig = getTemplateConfig(templateId);
  const isFree = isFreeTemplate(templateId);
  const canEdit = isFree || isPurchased === true;

  // Resizable panel state
  const [formWidth, setFormWidth] = useState(480);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.min(Math.max(e.clientX - rect.left, 280), rect.width - 300);
      setFormWidth(newWidth);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function startDragging(e: React.MouseEvent) {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

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

  // Check if user has purchased this template
  useEffect(() => {
    if (sessionLoading || !userId) return;
    if (isFree) {
      setIsPurchased(true);
      return;
    }
    fetch(`/api/purchase?templateId=${encodeURIComponent(templateId)}`)
      .then((res) => res.json())
      .then((json) => setIsPurchased(json.owned === true))
      .catch(() => setIsPurchased(false));
  }, [userId, sessionLoading, templateId, isFree]);

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

  const handleBuy = useCallback(async () => {
    setBuyLoading(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const json = await res.json();
      if (json.success) {
        setIsPurchased(true);
        toast.success("Template unlocked!", {
          description: `You now have full access to the ${entry?.name} template.`,
        });
      } else {
        toast.error("Purchase failed", { description: json.error });
      }
    } catch {
      toast.error("Purchase failed");
    } finally {
      setBuyLoading(false);
    }
  }, [templateId, entry?.name]);

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
          {canEdit && (
            <>
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
              {/* Upload to GitHub button */}
              <button
                onClick={async () => {
                  await handleSave();
                  setShowGitHubDialog(true);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Github size={14} strokeWidth={1.5} />
                <span>GitHub</span>
              </button>
              {/* Deploy to Vercel button */}
              <button
                onClick={async () => {
                  await handleSave();
                  setShowVercelDialog(true);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <svg width={14} height={14} viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
                <span>Vercel</span>
              </button>
              {/* Save button */}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 pl-2 pr-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save size={14} strokeWidth={1.5} />
                <span className="italic-main font-bold">Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Form + Preview split */}
      <div ref={containerRef} className="flex flex-1 min-h-0">
        {/* Form panel — resizable */}
        <div
          style={{ width: formWidth }}
          className="relative flex-shrink-0 overflow-hidden bg-background"
        >
          {/* Purchase overlay — fixed over viewport, blocks scroll & interaction */}
          {!canEdit && isPurchased !== null && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-background/80">
              <div className="flex flex-col items-center gap-4 text-center px-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Lock size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Unlock this template</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purchase the {name} template to customize and deploy it.
                  </p>
                </div>
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {buyLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                  <span>
                    {buyLoading
                      ? "Processing..."
                      : `Buy for ${(templateConfig && getDiscountedPrice(templateConfig)) || templateConfig?.price || ""}`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Scrollable form content */}
          <div className={`h-full overflow-y-auto overflow-x-hidden ${!canEdit ? "pointer-events-none" : ""}`}>
            <Form key={formKey} initialData={portfolioData} onChange={handleChange} />
          </div>
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={startDragging}
          className="w-1 flex-shrink-0 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
        />

        {/* Live preview */}
        <BrowserPreview url={`portfolio.porto.build/${portfolioData.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Preview {...portfolioData} />
        </BrowserPreview>
      </div>

      <GitHubUploadDialog
        open={showGitHubDialog}
        onOpenChange={setShowGitHubDialog}
        source="template"
        templateId={templateId}
        portfolioData={portfolioData}
        portfolioName={portfolioData.name}
      />
      <VercelDeployDialog
        open={showVercelDialog}
        onOpenChange={setShowVercelDialog}
        source="template"
        templateId={templateId}
        portfolioData={portfolioData}
        portfolioName={portfolioData.name}
      />
    </div>
  );
}

