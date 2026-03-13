"use client";

import { XIcon } from "@/components/ui/icons";

interface FileTabsProps {
  openFiles: string[];
  activeFile: string | null;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
}

function getFileName(path: string) {
  return path.split("/").pop() || path;
}

export function FileTabs({ openFiles, activeFile, onSelectTab, onCloseTab }: FileTabsProps) {
  if (openFiles.length === 0) return null;

  return (
    <div className="flex border-b border-zinc-800 bg-zinc-900">
      {openFiles.map((path) => (
        <div
          key={path}
          className={`group flex cursor-pointer items-center gap-1.5 border-r border-zinc-800 px-3 py-1.5 text-xs ${
            path === activeFile
              ? "border-t-2 border-t-blue-500 bg-zinc-800 text-zinc-100"
              : "border-t-2 border-t-transparent text-zinc-500 hover:bg-zinc-800/50"
          }`}
          onClick={() => onSelectTab(path)}
        >
          <span>{getFileName(path)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(path);
            }}
            className="rounded p-0.5 opacity-0 hover:bg-zinc-700 group-hover:opacity-100"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
