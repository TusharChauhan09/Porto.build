"use client";

import { RefreshIcon } from "@/components/ui/icons";
import { useState, useRef, useCallback } from "react";

interface PreviewProps {
  url: string | null;
}

export function Preview({ url }: PreviewProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const injectScrollbarStyles = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const existing = doc.getElementById("__porto-scrollbar");
      if (existing) return;
      const style = doc.createElement("style");
      style.id = "__porto-scrollbar";
      style.textContent = `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
        * { scrollbar-width: thin; scrollbar-color: #222 #000; }
      `;
      doc.head.appendChild(style);
    } catch {
      // cross-origin — nothing we can do
    }
  }, []);

  if (!url) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-900 text-zinc-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
        <span className="text-sm">Starting sandbox...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col scrollbar-black">
      {/* Preview toolbar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          title="Refresh preview"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
        </button>
        <span className="truncate text-xs text-zinc-500 flex-1">{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
        >
          Open in new tab
        </a>
      </div>

      {/* iframe */}
      <iframe
        ref={iframeRef}
        key={refreshKey}
        src={url}
        onLoad={injectScrollbarStyles}
        className="h-full w-full flex-1 border-0 bg-zinc-950"
        style={{ colorScheme: "dark" }}
        title="Preview"
      />
    </div>
  );
}
