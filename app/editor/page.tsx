"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { FileTree } from "@/components/editor/FileTree";
import { FileTabs } from "@/components/editor/FileTabs";
import { Preview } from "@/components/editor/Preview";
import { useDebouncedCallback } from "@/lib/hooks/use-debounce";

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

export default function EditorPage() {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor state
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Map<string, string>>(new Map());

  // Create sandbox on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/sandbox/create", { method: "POST" });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);
      } catch {
        setError("Failed to create sandbox");
      }
      setIsCreating(false);
    }
    init();
  }, []);

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
    <div className="flex h-screen w-screen bg-zinc-950 font-mono text-zinc-100">
      {/* Left panel — File tree */}
      <div className="flex w-64 shrink-0 flex-col border-r border-zinc-800">
        {sandboxId && (
          <FileTree
            sandboxId={sandboxId}
            selectedPath={activeFile}
            onFileSelect={handleFileSelect}
            onTreeChange={handleTreeChange}
          />
        )}
      </div>

      {/* Right area — Tabs + Editor + Preview */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* File tabs */}
        <FileTabs
          openFiles={openFiles}
          activeFile={activeFile}
          onSelectTab={handleTabSelect}
          onCloseTab={handleTabClose}
        />

        {/* Editor + Preview split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code editor */}
          <div className="flex flex-1 flex-col overflow-hidden">
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

          {/* Divider */}
          <div className="w-px shrink-0 bg-zinc-800" />

          {/* Live preview */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Preview url={previewUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
