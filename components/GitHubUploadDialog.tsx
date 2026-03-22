"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Github, Loader2, ExternalLink, Globe, Lock } from "lucide-react";
import { signIn } from "@/lib/auth-client";
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

interface GitHubUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: "template" | "sandbox";
  templateId: string;
  portfolioData?: PortfolioProps;
  sandboxId?: string;
  portfolioName: string;
}

function sanitizeRepoName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "my-portfolio"
  );
}

export function GitHubUploadDialog({
  open,
  onOpenChange,
  source,
  templateId,
  portfolioData,
  sandboxId,
  portfolioName,
}: GitHubUploadDialogProps) {
  const [repoName, setRepoName] = useState(sanitizeRepoName(portfolioName));
  const [isPrivate, setIsPrivate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  async function handleUpload() {
    if (!repoName.trim()) return;

    setUploading(true);
    try {
      const res = await fetch("/api/github/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repoName.trim(),
          isPrivate,
          templateId,
          portfolioData,
          sandboxId,
          source,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NO_GITHUB_ACCOUNT") {
          toast.error("No GitHub account linked", {
            description: "Redirecting to GitHub sign-in...",
          });
          await signIn.social({
            provider: "github",
            callbackURL: window.location.href,
          });
          return;
        }
        if (data.error === "INSUFFICIENT_SCOPE") {
          toast.error("Additional permissions needed", {
            description: "Re-authenticating with GitHub...",
          });
          await signIn.social({
            provider: "github",
            callbackURL: window.location.href,
          });
          return;
        }
        if (data.error === "REPO_EXISTS") {
          toast.error("Repository already exists", {
            description: "Please choose a different name.",
          });
          return;
        }
        toast.error("Upload failed", { description: data.message });
        return;
      }

      setRepoUrl(data.repoUrl);
      toast.success("Uploaded to GitHub!", {
        description: data.repoUrl,
        action: {
          label: "Open",
          onClick: () => window.open(data.repoUrl, "_blank"),
        },
      });
    } catch {
      toast.error("Upload failed", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setUploading(false);
    }
  }

  function handleClose(val: boolean) {
    if (!val) {
      // Reset state when closing
      setRepoUrl(null);
      setUploading(false);
    }
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Github size={18} />
            Upload to GitHub
          </SheetTitle>
          <SheetDescription>
            Push your portfolio to a new GitHub repository.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4">
          {/* Repo name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Repository name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="my-portfolio"
              disabled={uploading || !!repoUrl}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
            />
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Visibility</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                disabled={uploading || !!repoUrl}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                  !isPrivate
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Globe size={14} />
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                disabled={uploading || !!repoUrl}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                  isPrivate
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Lock size={14} />
                Private
              </button>
            </div>
          </div>

          {/* Success state */}
          {repoUrl && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="mb-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Repository created successfully
              </p>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
              >
                {repoUrl}
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <SheetFooter>
          {!repoUrl ? (
            <Button
              onClick={handleUpload}
              disabled={uploading || !repoName.trim()}
              className="w-full gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Github size={16} />
                  Upload to GitHub
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              className="w-full"
            >
              Done
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
