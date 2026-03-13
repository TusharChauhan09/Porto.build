"use client";

import { RefreshIcon } from "@/components/ui/icons";
import { useState } from "react";

interface PreviewProps {
  url: string | null;
}

export function Preview({ url }: PreviewProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!url) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-900 text-zinc-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
        <span className="text-sm">Starting sandbox...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Preview toolbar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          title="Refresh preview"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
        </button>
        <span className="truncate text-xs text-zinc-500">{url}</span>
      </div>

      {/* iframe */}
      <iframe
        key={refreshKey}
        src={url}
        className="h-full w-full flex-1 border-0 bg-white"
        title="Preview"
      />
    </div>
  );
}
