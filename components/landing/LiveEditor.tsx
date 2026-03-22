"use client";

import { Check, DeviceMobile, Cube } from "@phosphor-icons/react";

const features = [
  {
    Icon: Check,
    title: "Instant visual feedback",
    desc: "Changes to typography, colors, and layout update instantly. No page reloads needed.",
  },
  {
    Icon: DeviceMobile,
    title: "Device previews",
    desc: "Toggle between desktop, tablet, and mobile views instantly to ensure perfect responsiveness.",
  },
  {
    Icon: Cube,
    title: "Smart layouts",
    desc: "Our engine automatically adjusts padding and spacing based on the components you add.",
  },
];

export function LiveEditor() {
  return (
    <section className="py-24 border-b border-black/5 dark:border-white/[0.06] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-brand block mb-4">
              Real-time engine
            </span>
            <h2 className="text-4xl md:text-[40px] font-semibold tracking-tight mb-8 text-foreground">
              What you see is exactly what you get.
            </h2>

            <div className="flex flex-col gap-6">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-brand/15">
                    <f.Icon weight="bold" className="text-brand w-2.5 h-2.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-1">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D mockup */}
          <div className="relative h-[500px] w-full flex items-center justify-center" style={{ perspective: "1000px" }}>
            <div className="relative w-[400px] h-[300px] md:w-[500px] md:h-[350px]">
              {/* Back card (editor) */}
              <div
                className="glass-card absolute inset-0 z-10 p-4 flex flex-col gap-3"
                style={{
                  transform: "rotateY(-8deg) rotateX(4deg) translateZ(-40px) translateX(-20px)",
                  opacity: 0.8,
                }}
              >
                <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded flex items-center px-3 border border-black/5 dark:border-white/5">
                  <div className="w-1/3 h-2 bg-black/10 dark:bg-white/10 rounded" />
                </div>
                <div className="flex gap-3 h-full">
                  <div className="w-1/4 h-full bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 flex flex-col gap-2 p-2">
                    <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded" />
                    <div className="w-3/4 h-4 bg-black/10 dark:bg-white/10 rounded" />
                    <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded mt-4" />
                  </div>
                  <div className="flex-1 h-full bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 p-4 flex flex-col gap-4">
                    <div className="w-1/2 h-8 bg-black/10 dark:bg-white/10 rounded" />
                    <div className="w-full h-32 bg-black/10 dark:bg-white/10 rounded" />
                  </div>
                </div>
              </div>

              {/* Front card (preview) */}
              <div
                className="glass-card absolute inset-0 z-20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                style={{
                  transform: "rotateY(-8deg) rotateX(4deg) translateZ(40px) translateX(40px) translateY(20px)",
                }}
              >
                <div className="h-10 bg-white/50 dark:bg-black/60 border-b border-black/10 dark:border-white/10 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 flex flex-col gap-4">
                  <div className="w-1/2 h-8 bg-white rounded shadow-lg" />
                  <div className="w-full h-32 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 mt-4 flex items-center justify-center text-white/50 text-sm">
                    Hero Image
                  </div>
                  <div className="w-3/4 h-4 bg-white/40 rounded" />
                  <div className="w-1/2 h-4 bg-white/40 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
