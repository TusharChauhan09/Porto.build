"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ExternalLink,
  CheckCircle2,
  Circle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

function VercelIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 65"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

interface VercelDeployDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: "template" | "sandbox";
  templateId: string;
  portfolioData?: PortfolioProps;
  sandboxId?: string;
  portfolioName: string;
}

type DeployStatus = "idle" | "deploying" | "building" | "ready" | "error";

function sanitizeProjectName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-portfolio"
  );
}

export function VercelDeployDialog({
  open,
  onOpenChange,
  source,
  templateId,
  portfolioData,
  sandboxId,
  portfolioName,
}: VercelDeployDialogProps) {
  const [projectName, setProjectName] = useState(
    sanitizeProjectName(portfolioName)
  );
  const [status, setStatus] = useState<DeployStatus>("idle");
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasVercelToken, setHasVercelToken] = useState<boolean | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [savingToken, setSavingToken] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failCountRef = useRef(0);

  // Check Vercel connection when dialog opens
  useEffect(() => {
    if (!open) return;
    fetch("/api/vercel/status?check=connection")
      .then((res) => res.json())
      .then((data) => setHasVercelToken(data.connected))
      .catch(() => setHasVercelToken(false));
  }, [open]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  function startPolling(deploymentId: string) {
    failCountRef.current = 0;
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/vercel/status?deploymentId=${deploymentId}`
        );
        const data = await res.json();

        if (!res.ok) {
          failCountRef.current++;
          if (failCountRef.current >= 3) {
            stopPolling();
            setStatus("error");
            setErrorMessage(
              data.message || "Failed to check deployment status"
            );
          }
          return;
        }

        failCountRef.current = 0;

        if (data.readyState === "READY") {
          stopPolling();
          const finalUrl = `https://${data.url}`;
          setDeploymentUrl(finalUrl);
          setStatus("ready");
          toast.success("Deployed to Vercel!", {
            description: finalUrl,
            action: {
              label: "Visit",
              onClick: () => window.open(finalUrl, "_blank"),
            },
          });
        } else if (
          data.readyState === "ERROR" ||
          data.readyState === "CANCELED"
        ) {
          stopPolling();
          setStatus("error");
          setErrorMessage(
            data.errorMessage ||
              "Build failed. Please check your project configuration."
          );
        }
      } catch {
        failCountRef.current++;
        if (failCountRef.current >= 3) {
          stopPolling();
          setStatus("error");
          setErrorMessage("Connection lost while checking deployment status.");
        }
      }
    }, 3000);
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  async function handleSaveToken() {
    if (!tokenInput.trim()) return;
    setSavingToken(true);
    try {
      const res = await fetch("/api/vercel/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Invalid token", {
          description: data.message || "Could not verify the token.",
        });
        return;
      }
      setHasVercelToken(true);
      setTokenInput("");
      toast.success("Vercel account connected");
    } catch {
      toast.error("Failed to save token");
    } finally {
      setSavingToken(false);
    }
  }

  async function handleDeploy() {
    if (!projectName.trim()) return;

    setStatus("deploying");
    setErrorMessage(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const res = await fetch("/api/vercel/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName.trim(),
          templateId,
          portfolioData,
          sandboxId,
          source,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NO_VERCEL_ACCOUNT") {
          setHasVercelToken(false);
          setStatus("idle");
          toast.error("No Vercel token found", {
            description: "Please add your Vercel API token.",
          });
          return;
        }
        if (data.error === "TOKEN_EXPIRED") {
          setHasVercelToken(false);
          setStatus("idle");
          toast.error("Vercel token invalid", {
            description: "Please add a new Vercel API token.",
          });
          return;
        }
        setStatus("error");
        setErrorMessage(data.message || "Deployment failed");
        return;
      }

      // Deployment created — start polling
      setStatus("building");
      startPolling(data.deploymentId);
    } catch (err) {
      setStatus("error");
      if (err instanceof DOMException && err.name === "AbortError") {
        setErrorMessage(
          "Request timed out. The sandbox may have expired — try re-opening the editor."
        );
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  function handleRetry() {
    setStatus("idle");
    setErrorMessage(null);
    setDeploymentUrl(null);
  }

  function handleClose(val: boolean) {
    if (!val) {
      stopPolling();
      setStatus("idle");
      setDeploymentUrl(null);
      setErrorMessage(null);
      setTokenInput("");
      setShowToken(false);
    }
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <VercelIcon size={16} />
            Deploy to Vercel
          </SheetTitle>
          <SheetDescription>
            Deploy your portfolio to Vercel and get a live URL.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4">
          {/* Token input — shown when no token is stored */}
          {hasVercelToken === false && status === "idle" && (
            <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4">
              <div className="flex flex-col gap-1">
                <VercelIcon size={20} />
                <p className="text-sm font-medium mt-2">
                  Connect your Vercel account
                </p>
                <p className="text-xs text-muted-foreground">
                  Paste your API token from{" "}
                  <a
                    href="https://vercel.com/account/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    vercel.com/account/tokens
                  </a>
                </p>
              </div>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your Vercel token..."
                  disabled={savingToken}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 pr-9 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <Button
                onClick={handleSaveToken}
                disabled={!tokenInput.trim() || savingToken}
                className="gap-2"
                size="sm"
              >
                {savingToken ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Save Token"
                )}
              </Button>
            </div>
          )}

          {/* Project name input */}
          {hasVercelToken !== false && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Project name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-portfolio"
                disabled={status !== "idle"}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
              />
            </div>
          )}

          {/* Build progress */}
          {(status === "building" || status === "ready") && (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-muted-foreground">Files uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {status === "building" ? (
                  <Loader2
                    size={16}
                    className="animate-spin text-blue-500"
                  />
                ) : (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                )}
                <span className="text-muted-foreground">Building project</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {status === "ready" ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-muted-foreground/40" />
                )}
                <span className="text-muted-foreground">Deployed</span>
              </div>
            </div>
          )}

          {/* Success state */}
          {status === "ready" && deploymentUrl && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="mb-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Deployment is live!
              </p>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
              >
                {deploymentUrl}
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Error state */}
          {status === "error" && errorMessage && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <XCircle size={14} className="text-red-500" />
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  Deployment failed
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <SheetFooter>
          {status === "idle" && hasVercelToken !== false && (
            <Button
              onClick={handleDeploy}
              disabled={!projectName.trim() || hasVercelToken === null}
              className="w-full gap-2"
            >
              {hasVercelToken === null ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <VercelIcon size={14} />
                  Deploy to Vercel
                </>
              )}
            </Button>
          )}
          {status === "deploying" && (
            <Button disabled className="w-full gap-2">
              <Loader2 size={16} className="animate-spin" />
              Creating deployment...
            </Button>
          )}
          {status === "building" && (
            <Button disabled className="w-full gap-2">
              <Loader2 size={16} className="animate-spin" />
              Building...
            </Button>
          )}
          {status === "ready" && (
            <div className="flex w-full gap-2">
              <Button
                onClick={() => window.open(deploymentUrl!, "_blank")}
                className="flex-1 gap-2"
              >
                <ExternalLink size={14} />
                Visit Site
              </Button>
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          )}
          {status === "error" && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="w-full gap-2"
            >
              Retry
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
