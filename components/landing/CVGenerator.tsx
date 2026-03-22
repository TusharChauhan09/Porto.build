"use client";

import { FilePdf, Faders, Palette } from "@phosphor-icons/react";

const features = [
  {
    Icon: FilePdf,
    title: "One-click PDF export",
    desc: "Extract all your portfolio data into a perfectly formatted, ATS-friendly PDF instantly.",
  },
  {
    Icon: Faders,
    title: "Tailor for the role",
    desc: "Toggle which projects and experiences appear in your CV to match the specific job you're applying for.",
  },
  {
    Icon: Palette,
    title: "Matched branding",
    desc: "Your CV inherits the fonts, accent colors, and styling of your main portfolio site.",
  },
];

export function CVGenerator() {
  return (
    <section className="py-24 bg-transparent dark:bg-black overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* CV mockup */}
          <div className="relative h-[500px] w-full flex items-center justify-center lg:order-2">
            <div className="w-[340px] md:w-[400px] bg-white/80 dark:bg-white rounded-2xl shadow-2xl dark:shadow-2xl p-8 border border-white/40 dark:border-gray-100 backdrop-blur-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Header */}
              <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-3/4 h-5 bg-gray-800 rounded" />
                  <div className="w-1/2 h-3 bg-gray-400 rounded" />
                </div>
              </div>

              {/* Sections */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="w-1/3 h-3 bg-brand/30 rounded mb-3" />
                  <div className="w-full h-2 bg-gray-200 rounded mb-2" />
                  <div className="w-5/6 h-2 bg-gray-200 rounded mb-2" />
                  <div className="w-4/6 h-2 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="w-1/3 h-3 bg-brand/30 rounded mb-3" />
                  <div className="w-full h-2 bg-gray-200 rounded mb-2" />
                  <div className="w-11/12 h-2 bg-gray-200 rounded mb-2" />
                  <div className="flex items-center gap-1">
                    <div className="w-1/2 h-2 bg-gray-200 rounded" />
                    <span className="text-brand font-bold text-sm leading-none cursor-blink">|</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow behind CV */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand/10 blur-[60px] rounded-full z-[-1]" />
          </div>

          {/* Text */}
          <div className="lg:order-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-brand block mb-4">
              Auto-generate
            </span>
            <h2 className="text-4xl md:text-[40px] font-semibold tracking-tight mb-8 text-foreground">
              Turn your site into a tailored CV.
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
        </div>
      </div>
    </section>
  );
}
