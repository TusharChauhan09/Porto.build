"use client";

import { useRef, useState, useEffect } from "react";

interface TemplatePreviewProps {
  children: React.ReactNode;
  contentWidth?: number;
  delay?: number;
}

export function TemplatePreview({
  children,
  contentWidth = 1280,
  delay = 0,
}: TemplatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(0.3);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

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

  // Observe content size for scroll distance calculation
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !hasBeenVisible || scale === 0) return;
    const ro = new ResizeObserver(([entry]) => {
      const contentHeight = entry.contentRect.height;
      const visibleContentHeight = containerHeight / scale;
      const dist = Math.max(0, contentHeight - visibleContentHeight);
      setScrollDistance(dist);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasBeenVisible, containerHeight, scale]);

  // Intersection observer for visibility & lazy mounting
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasBeenVisible]);

  const duration = Math.max(15, scrollDistance / 25);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {hasBeenVisible && (
        <div
          style={{
            width: `${contentWidth}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            ref={contentRef}
            className="template-auto-scroll"
            style={
              {
                "--scroll-distance": `-${scrollDistance}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                animationPlayState: isVisible ? "running" : "paused",
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
