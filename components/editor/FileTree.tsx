"use client";

import { useState, useEffect, useCallback } from "react";
import { FileTreeItem } from "./FileTreeItem";
import { PlusIcon, FolderIcon } from "@/components/ui/icons";

interface EntryInfo {
  name: string;
  type: "file" | "dir";
  path: string;
}

interface FileTreeProps {
  sandboxId: string;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  onTreeChange: () => void;
}

export function FileTree({ sandboxId, selectedPath, onFileSelect, onTreeChange }: FileTreeProps) {
  const [entries, setEntries] = useState<EntryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemType, setNewItemType] = useState<"file" | "dir" | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/sandbox/files?id=${sandboxId}&path=/home/user`);
      const data = await res.json();
      const sorted = (data.entries as EntryInfo[]).sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setEntries(sorted);
    } catch {
      setEntries([]);
    }
    setIsLoading(false);
  }, [sandboxId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleCreateItem() {
    if (!newItemName.trim() || !newItemType) return;

    const path = `/home/user/${newItemName.trim()}`;

    try {
      if (newItemType === "file") {
        await fetch("/api/sandbox/files/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sandboxId, path, content: "" }),
        });
      } else {
        await fetch("/api/sandbox/files/mkdir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sandboxId, path }),
        });
      }
      setNewItemType(null);
      setNewItemName("");
      fetchEntries();
      onTreeChange();
    } catch {
      // Failed to create
    }
  }

  async function handleDelete(path: string) {
    try {
      await fetch("/api/sandbox/files/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sandboxId, path }),
      });
      fetchEntries();
      onTreeChange();
    } catch {
      // Failed to delete
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-zinc-800 px-3 py-2">
        <span className="flex-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Explorer
        </span>
        <button
          onClick={() => setNewItemType("file")}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          title="New File"
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setNewItemType("dir")}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          title="New Folder"
        >
          <FolderIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* New item input */}
      {newItemType && (
        <div className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-800/50 px-3 py-1.5">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateItem();
              if (e.key === "Escape") {
                setNewItemType(null);
                setNewItemName("");
              }
            }}
            placeholder={newItemType === "file" ? "filename.tsx" : "folder-name"}
            className="flex-1 rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-200 outline-none ring-1 ring-zinc-700 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleCreateItem}
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500"
          >
            Create
          </button>
          <button
            onClick={() => {
              setNewItemType(null);
              setNewItemName("");
            }}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto py-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-xs text-zinc-600">
            Loading files...
          </div>
        ) : entries.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-zinc-600">
            No files found
          </div>
        ) : (
          entries.map((entry) => (
            <FileTreeItem
              key={entry.path}
              entry={entry}
              depth={0}
              sandboxId={sandboxId}
              selectedPath={selectedPath}
              onFileSelect={onFileSelect}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
