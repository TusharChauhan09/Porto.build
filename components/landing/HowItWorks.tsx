"use client";

import { Layout, MagicWand, RocketLaunch } from "@phosphor-icons/react";

const steps = [
  {
    num: "1",
    Icon: Layout,
    title: "Choose a foundation",
    desc: "Select from our curated gallery of premium layouts designed for conversion and aesthetics.",
  },
  {
    num: "2",
    Icon: MagicWand,
    title: "Add your content",
    desc: "Use our intuitive block editor to drag in projects, text, and media. We handle the responsive sizing.",
  },
  {
    num: "3",
    Icon: RocketLaunch,
    title: "Publish to the world",
    desc: "Hit deploy and get a blazing fast site on our global CDN with a custom domain included.",
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-transparent dark:bg-black relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand block mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-[40px] font-semibold tracking-tight text-foreground">
            From blank canvas to live site.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Dashed connector line */}
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-black/10 dark:border-white/20 z-0" />

          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center z-10">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[120px] font-bold text-foreground/[0.06] leading-none select-none z-[-1]">
                {step.num}
              </div>
              <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center mb-6 border border-brand/20">
                <step.Icon weight="fill" className="text-brand w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground max-w-[280px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
