"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

const templates = [
  { name: "Minimalist Pro", tag: "Designer", gradient: "from-indigo-500 to-purple-900" },
  { name: "Tech Stack", tag: "Developer", gradient: "from-emerald-500 to-teal-900" },
  { name: "Lens Flare", tag: "Photographer", gradient: "from-rose-500 to-orange-800" },
  { name: "Chronicle", tag: "Writer", gradient: "from-amber-400 to-orange-700" },
  { name: "Studio X", tag: "Agency", gradient: "from-cyan-500 to-blue-900" },
  { name: "Launchpad", tag: "Product", gradient: "from-violet-500 to-fuchsia-900" },
];

export function TemplateShowcase() {
  return (
    <section id="templates" className="py-24 border-b border-black/5 dark:border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-brand block mb-4">
              World-class designs
            </span>
            <h2 className="text-4xl md:text-[40px] font-semibold tracking-tight text-foreground">
              Start with a stunning template.
            </h2>
          </div>
          <Link
            href="/arena/templates"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            View all templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div
              key={t.name}
              className="glass-card group relative h-64 overflow-hidden cursor-pointer flex flex-col justify-end p-2"
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-2 bg-gradient-to-br ${t.gradient} rounded-xl z-0 opacity-80 group-hover:opacity-100 transition-opacity`}
              />

              {/* Tag */}
              <div
                className="absolute top-4 right-4 z-10 rounded-full px-3 py-1"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              >
                <span className="text-[11px] text-white font-medium">{t.tag}</span>
              </div>

              {/* Name */}
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-sm font-semibold text-white">{t.name}</h3>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-x-2 bottom-2 top-[50%] bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex items-end justify-center pb-6 rounded-b-xl">
                <button className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  Preview →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
