"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Save, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import type { CVData } from "@/lib/cv-types";
import { DEFAULT_CV_DATA } from "@/lib/default-cv-data";
import CvForm from "@/components/cv/CvForm";
import CvPreview from "@/components/cv/CvPreview";
import { A4Preview } from "@/components/cv/A4Preview";

const CV_STORAGE_PREFIX = "porto_cv_";

function storageKey(userId: string): string {
  return `${CV_STORAGE_PREFIX}${userId}`;
}

function loadSavedData(userId: string): Partial<CVData> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveDataLocal(userId: string, data: CVData) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

export default function CvMakerPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const userId = session?.user?.id;

  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);

  // Resizable panel state
  const [formWidth, setFormWidth] = useState(480);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.min(
        Math.max(e.clientX - rect.left, 280),
        rect.width - 300
      );
      setFormWidth(newWidth);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function startDragging(e: React.MouseEvent) {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  // Fetch CV data from the server
  const fetchFromServer = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/cv");
      const json = await res.json();
      if (json.data) {
        const serverData = json.data as Partial<CVData>;
        const merged: CVData = {
          ...DEFAULT_CV_DATA,
          ...serverData,
          personalInfo: {
            ...DEFAULT_CV_DATA.personalInfo,
            ...(serverData.personalInfo ?? {}),
          },
          colors: {
            ...DEFAULT_CV_DATA.colors,
            ...(serverData.colors ?? {}),
          },
          sectionOrder:
            serverData.sectionOrder ?? DEFAULT_CV_DATA.sectionOrder,
        };
        setCvData(merged);
        saveDataLocal(userId, merged);
        setFormKey((k) => k + 1);
      }
    } catch {
      // Server unavailable — localStorage data is fine as fallback
    }
  }, [userId]);

  // Load data on mount: localStorage first, then server
  useEffect(() => {
    if (sessionLoading || !userId) return;

    const localData = loadSavedData(userId);
    if (localData) {
      setCvData({
        ...DEFAULT_CV_DATA,
        ...localData,
        personalInfo: {
          ...DEFAULT_CV_DATA.personalInfo,
          ...(localData.personalInfo ?? {}),
        },
        colors: {
          ...DEFAULT_CV_DATA.colors,
          ...(localData.colors ?? {}),
        },
        sectionOrder:
          localData.sectionOrder ?? DEFAULT_CV_DATA.sectionOrder,
      });
    }

    fetchFromServer().finally(() => setDataLoaded(true));
  }, [userId, sessionLoading, fetchFromServer]);

  // Re-fetch when user comes back to this tab
  useEffect(() => {
    if (!userId) return;

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchFromServer();
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", fetchFromServer);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", fetchFromServer);
    };
  }, [userId, fetchFromServer]);

  // Mark loaded if no session
  useEffect(() => {
    if (!sessionLoading && !userId) {
      setDataLoaded(true);
    }
  }, [sessionLoading, userId]);

  const handleChange = useCallback((data: CVData) => {
    setCvData(data);
  }, []);

  const handleSave = useCallback(async () => {
    if (!userId) return;
    setSaving(true);

    saveDataLocal(userId, cvData);

    try {
      await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData }),
      });
      toast.success("CV saved");
    } catch {
      toast.error("Server save failed", {
        description: "Changes saved locally as backup",
      });
    } finally {
      setSaving(false);
    }
  }, [userId, cvData]);

  const handleDownloadPdf = useCallback(() => {
    window.print();
  }, []);

  // Loading state
  if (sessionLoading || !dataLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Loading your CV...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" id="cv-maker-root">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight">CV Maker</h1>
          <span className="text-[10px] text-muted-foreground font-mono uppercase">
            Editor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Download size={14} strokeWidth={1.5} />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 pl-2 pr-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Save size={14} strokeWidth={1.5} />
            )}
            <span className="italic-main font-bold">
              {saving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </div>

      {/* Form + Preview split */}
      <div ref={containerRef} className="flex flex-1 min-h-0">
        {/* Form panel */}
        <div
          style={{ width: formWidth }}
          className="relative flex-shrink-0 overflow-hidden bg-background print:hidden"
        >
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <CvForm
              key={formKey}
              initialData={cvData}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={startDragging}
          className="w-1 flex-shrink-0 cursor-col-resize bg-border hover:bg-primary/50 transition-colors print:hidden"
        />

        {/* Live preview */}
        <A4Preview>
          <CvPreview data={cvData} />
        </A4Preview>
      </div>
    </div>
  );
}
