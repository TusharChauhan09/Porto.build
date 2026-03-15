"use client";

interface BrowserPreviewProps {
  url?: string;
  children: React.ReactNode;
}

export function BrowserPreview({ url, children }: BrowserPreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 p-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-border bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Browser chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-zinc-800 rounded-md px-3 py-1 text-[11px] text-zinc-500 font-mono truncate">
              {url ?? "portfolio.porto.build"}
            </div>
          </div>
        </div>
        {/* Preview content */}
        {children}
      </div>
    </div>
  );
}
