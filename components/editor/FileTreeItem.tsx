"use client";

import { useState } from "react";
import {
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@/components/ui/icons";

interface EntryInfo {
  name: string;
  type: "file" | "dir";
  path: string;
}

interface FileTreeItemProps {
  entry: EntryInfo;
  depth: number;
  sandboxId: string;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  onDelete: (path: string) => void;
}

export function FileTreeItem({
  entry,
  depth,
  sandboxId,
  selectedPath,
  onFileSelect,
  onDelete,
}: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<EntryInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDir = entry.type === "dir";
  const isSelected = entry.path === selectedPath;

  async function toggleFolder() {
    if (!isDir) return;

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    // Fetch children on first expand
    if (!children) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/sandbox/files?id=${sandboxId}&path=${encodeURIComponent(entry.path)}`
        );
        const data = await res.json();
        const sorted = (data.entries as EntryInfo[]).sort((a, b) => {
          // Directories first, then alphabetical
          if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        setChildren(sorted);
      } catch {
        setChildren([]);
      }
      setIsLoading(false);
    }

    setIsOpen(true);
  }

  function handleClick() {
    if (isDir) {
      toggleFolder();
    } else {
      onFileSelect(entry.path);
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(entry.path);
  }

  // Refresh children after a delete inside this folder
  function handleChildDelete(path: string) {
    onDelete(path);
    // Remove from local children state
    if (children) {
      setChildren(children.filter((c) => c.path !== path));
    }
  }

  return (
    <div>
      {/* Entry row */}
      <div
        className={`group flex cursor-pointer items-center gap-1 px-2 py-0.5 text-xs hover:bg-zinc-800/50 ${
          isSelected ? "bg-zinc-800 text-zinc-100" : "text-zinc-400"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Chevron for folders */}
        {isDir ? (
          <ChevronRightIcon
            className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Icon */}
        {isDir ? (
          isOpen ? (
            <FolderOpenIcon className="h-4 w-4 shrink-0 text-yellow-500" />
          ) : (
            <FolderIcon className="h-4 w-4 shrink-0 text-yellow-500" />
          )
        ) : (
          <FileIcon className="h-4 w-4 shrink-0 text-blue-400" />
        )}

        {/* Name */}
        <span className="truncate">{entry.name}</span>

        {/* Delete button (visible on hover) */}
        <button
          onClick={handleDelete}
          className="ml-auto shrink-0 rounded p-0.5 text-zinc-600 opacity-0 hover:bg-zinc-700 hover:text-red-400 group-hover:opacity-100"
          title="Delete"
        >
          <TrashIcon className="h-3 w-3" />
        </button>
      </div>

      {/* Children (if directory is open) */}
      {isDir && isOpen && (
        <div>
          {isLoading ? (
            <div
              className="py-1 text-xs text-zinc-600"
              style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
            >
              Loading...
            </div>
          ) : (
            children?.map((child) => (
              <FileTreeItem
                key={child.path}
                entry={child}
                depth={depth + 1}
                sandboxId={sandboxId}
                selectedPath={selectedPath}
                onFileSelect={onFileSelect}
                onDelete={handleChildDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
