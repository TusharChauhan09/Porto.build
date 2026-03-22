"use client";

import { useRef, useState, useEffect } from "react";

interface TemplatePreviewProps {
  children: React.ReactNode;
  contentWidth?: number;
}

export function TemplatePreview({
  children,
  contentWidth = 1280,
}: TemplatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(0.3);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Observe container size for scale calculation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      setScale(w / contentWidth);
      setContainerHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [contentWidth]);

  // Mount/unmount children based on proximity to viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      {isNearViewport && (
        <div
          style={{
            width: `${contentWidth}px`,
            height: scale > 0 ? `${containerHeight / scale}px` : undefined,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
