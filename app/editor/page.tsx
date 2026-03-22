"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Github } from "lucide-react";
import { toast } from "sonner";
import { FileTree } from "@/components/editor/FileTree";
import { FileTabs } from "@/components/editor/FileTabs";
import { Preview } from "@/components/editor/Preview";
import { useDebouncedCallback } from "@/lib/hooks/use-debounce";
import { GitHubUploadDialog } from "@/components/GitHubUploadDialog";
import { VercelDeployDialog } from "@/components/VercelDeployDialog";

// Load CodeMirror only on client side (it doesn't support SSR)
const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false }
);

// Binary file extensions that shouldn't be opened in the editor
const BINARY_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".eot"];

function isBinaryFile(path: string) {
  return BINARY_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
}

// --- Resizable drag handle ---
function ResizeHandle({ onDrag }: { onDrag: (deltaX: number) => void }) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onDrag(delta);
    },
    [onDrag]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="w-1 shrink-0 cursor-col-resize bg-zinc-800 hover:bg-blue-500/60 active:bg-blue-500 transition-colors"
    />
  );
}

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingBack, setIsSavingBack] = useState(false);
  const [showGitHubDialog, setShowGitHubDialog] = useState(false);
  const [showVercelDialog, setShowVercelDialog] = useState(false);
  const templateId = searchParams.get("templateId");

  // Ref to avoid stale closures in event handlers
  const sandboxIdRef = useRef<string | null>(null);
  useEffect(() => {
    sandboxIdRef.current = sandboxId;
  }, [sandboxId]);

  // Kill sandbox via sendBeacon (reliable during page unload)
  const killCurrentSandbox = useCallback(() => {
    const id = sandboxIdRef.current;
    if (!id) return;
    navigator.sendBeacon(
      "/api/sandbox/kill",
      new Blob([JSON.stringify({ sandboxId: id })], { type: "application/json" })
    );
  }, []);

  // Editor state
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Map<string, string>>(new Map());

  // Panel widths (pixels for file tree, fraction for editor/preview split)
  const [treeWidth, setTreeWidth] = useState(256);
  const containerRef = useRef<HTMLDivElement>(null);
  // editorFraction: what fraction of (total - treeWidth) the editor takes
  const [editorFraction, setEditorFraction] = useState(0.5);

  const handleTreeResize = useCallback((delta: number) => {
    setTreeWidth((w) => Math.max(140, Math.min(480, w + delta)));
  }, []);

  const handleEditorResize = useCallback(
    (delta: number) => {
      if (!containerRef.current) return;
      const available = containerRef.current.offsetWidth - treeWidth - 8; // 8px for two handles
      if (available <= 0) return;
      setEditorFraction((f) => Math.max(0.15, Math.min(0.85, f + delta / available)));
    },
    [treeWidth]
  );

  // Use existing sandbox from query params, or create a new one
  useEffect(() => {
    const existingId = searchParams.get("sandboxId");
    const existingUrl = searchParams.get("previewUrl");

    if (existingId && existingUrl) {
      setSandboxId(existingId);
      setPreviewUrl(existingUrl);
      setIsCreating(false);
      return;
    }

    async function init() {
      try {
        const res = await fetch("/api/sandbox/create", { method: "POST" });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          toast.error("Sandbox creation failed", { description: data.error });
          return;
        }
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);
      } catch {
        setError("Failed to create sandbox");
        toast.error("Failed to create sandbox");
      }
      setIsCreating(false);
    }
    init();

    // Cleanup on unmount (SPA navigation away from /editor)
    return () => {
      killCurrentSandbox();
    };
  }, [searchParams, killCurrentSandbox]);

  // Kill sandbox on tab/browser close
  useEffect(() => {
    function handlePageHide() {
      killCurrentSandbox();
    }
    function handleBeforeUnload() {
      killCurrentSandbox();
    }

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [killCurrentSandbox]);

  // Auto-save: write file to sandbox 1 second after the user stops typing
  const debouncedWrite = useDebouncedCallback(
    useCallback(
      async (path: string, content: string) => {
        if (!sandboxId) return;
        await fetch("/api/sandbox/files/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sandboxId, path, content }),
        });
      },
      [sandboxId]
    ),
    1000
  );

  // Open a file in the editor
  async function handleFileSelect(path: string) {
    if (isBinaryFile(path)) return;

    // Add to open files if not already open
    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
    setActiveFile(path);

    // Fetch content if not cached
    if (!fileContents.has(path)) {
      try {
        const res = await fetch(
          `/api/sandbox/files/read?id=${sandboxId}&path=${encodeURIComponent(path)}`
        );
        const data = await res.json();
        setFileContents((prev) => new Map(prev).set(path, data.content || ""));
      } catch {
        setFileContents((prev) => new Map(prev).set(path, "// Failed to load file"));
        toast.error("Failed to load file", { description: path.split("/").pop() });
      }
    }
  }

  // Handle code changes in the editor
  function handleCodeChange(value: string) {
    if (!activeFile) return;
    setFileContents((prev) => new Map(prev).set(activeFile, value));
    debouncedWrite(activeFile, value);
  }

  // Switch active tab
  function handleTabSelect(path: string) {
    setActiveFile(path);
  }

  // Close a tab
  function handleTabClose(path: string) {
    setOpenFiles((prev) => prev.filter((f) => f !== path));
    setFileContents((prev) => {
      const next = new Map(prev);
      next.delete(path);
      return next;
    });
    // If closing active tab, switch to the last open file
    if (path === activeFile) {
      const remaining = openFiles.filter((f) => f !== path);
      setActiveFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  }

  // When tree changes (file created/deleted), clear cache for affected paths
  function handleTreeChange() {
    // Preview will auto-refresh via HMR
  }

  // Save sandbox data back to portfolio and kill sandbox before navigating away
  async function handleBack() {
    if (!sandboxId || !templateId) {
      router.back();
      return;
    }

    setIsSavingBack(true);
    try {
      // 1. Flush any pending debounced file writes to the sandbox
      debouncedWrite.flush();
      // Small delay to let the sandbox filesystem + HMR settle
      await new Promise((r) => setTimeout(r, 500));

      // 2. Extract portfolio data from sandbox page.tsx
      const extractRes = await fetch("/api/sandbox/extract-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxId }),
      });
      const extractJson = await extractRes.json();

      if (extractJson.portfolioData) {
        // 3. Save extracted data to the server portfolio
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId,
            portfolioData: extractJson.portfolioData,
          }),
        });
      }

      // 4. Kill the sandbox
      await fetch("/api/sandbox/kill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxId }),
      });
    } catch {
      toast.error("Could not save changes", { description: "Your sandbox edits may not be synced back" });
    } finally {
      // Clear ref so unmount cleanup doesn't double-fire
      sandboxIdRef.current = null;
      setIsSavingBack(false);
      router.back();
    }
  }

  // Loading / error states
  if (isCreating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
          <span className="text-sm">Creating sandbox...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-red-400">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-medium">Error</span>
          <span className="text-sm text-zinc-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-screen w-screen flex-col bg-zinc-950 font-mono text-zinc-100">
      {/* Top bar with back button */}
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3 py-1.5 shrink-0">
        <button
          onClick={handleBack}
          disabled={isSavingBack}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors disabled:opacity-50"
          title="Save & go back"
        >
          {isSavingBack ? (
            <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <ArrowLeft size={16} strokeWidth={1.5} />
          )}
        </button>
        <span className="text-xs font-medium text-zinc-400">
          {isSavingBack ? "Saving changes..." : "Sandbox Editor"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              debouncedWrite.flush();
              setShowGitHubDialog(true);
            }}
            disabled={!sandboxId || !templateId}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Github size={14} />
            <span>GitHub</span>
          </button>
          <button
            onClick={() => {
              debouncedWrite.flush();
              setShowVercelDialog(true);
            }}
            disabled={!sandboxId || !templateId}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <svg width={14} height={14} viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" /></svg>
            <span>Vercel</span>
          </button>
        </div>
      </div>

      {/* Main area: file tree | editor | preview */}
      <div className="flex flex-1 min-h-0">
        {/* File tree panel */}
        <div className="flex shrink-0 flex-col overflow-hidden" style={{ width: treeWidth }}>
          {sandboxId && (
            <FileTree
              sandboxId={sandboxId}
              selectedPath={activeFile}
              onFileSelect={handleFileSelect}
              onTreeChange={handleTreeChange}
            />
          )}
        </div>

        <ResizeHandle onDrag={handleTreeResize} />

        {/* Editor + Preview area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* File tabs */}
          <FileTabs
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectTab={handleTabSelect}
            onCloseTab={handleTabClose}
          />

          {/* Editor + Preview split */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Code editor */}
            <div className="flex flex-col overflow-hidden" style={{ width: `calc((100% - 4px) * ${editorFraction})` }}>
              {activeFile && fileContents.has(activeFile) ? (
                <CodeEditor
                  content={fileContents.get(activeFile)!}
                  filePath={activeFile}
                  onChange={handleCodeChange}
                />
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-zinc-600">
                  Select a file to start editing
                </div>
              )}
            </div>

            <ResizeHandle onDrag={handleEditorResize} />

            {/* Live preview */}
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
              <Preview url={previewUrl} />
            </div>
          </div>
        </div>
      </div>
      <GitHubUploadDialog
        open={showGitHubDialog}
        onOpenChange={setShowGitHubDialog}
        source="sandbox"
        templateId={templateId || ""}
        sandboxId={sandboxId || undefined}
        portfolioName="My Portfolio"
      />
      <VercelDeployDialog
        open={showVercelDialog}
        onOpenChange={setShowVercelDialog}
        source="sandbox"
        templateId={templateId || ""}
        sandboxId={sandboxId || undefined}
        portfolioName="My Portfolio"
      />
    </div>
  );
}
