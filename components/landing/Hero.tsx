"use client";

import Link from "next/link";
import { PlayCircle, LockKey } from "@phosphor-icons/react";

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center border-b border-black/5 dark:border-white/[0.06]">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid z-0" />

      {/* Glow — only in dark mode */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-transparent dark:bg-brand/20 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center w-full mt-6">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/[0.08] backdrop-blur-sm shadow-sm dark:shadow-none">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Now in Beta</span>
        </div>

        {/* Heading */}
        <h1 className="text-[56px] md:text-[72px] font-bold tracking-tight leading-[1.1] max-w-[768px] mb-6 text-gradient-hero">
          Craft your perfect portfolio <br className="hidden md:block" />
          <span className="font-serif italic font-normal !text-foreground" style={{ WebkitTextFillColor: "var(--foreground)" }}>
            effortlessly.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-muted-foreground max-w-[500px] mb-10 leading-relaxed">
          Build, manage, and deploy stunning personal sites in minutes. No coding required. Just your best work, presented beautifully.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Link
            href={isLoggedIn ? "/arena" : "/auth/signin"}
            className="bg-foreground text-background text-base font-semibold px-6 py-3 rounded-xl shadow-xl hover:-translate-y-[2px] transition-all duration-300 w-full sm:w-auto text-center"
          >
            Start building free
          </Link>
          <button className="text-foreground text-base font-semibold px-6 py-3 rounded-xl border border-white/40 dark:border-white/10 shadow-sm hover:-translate-y-[2px] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 bg-white/60 dark:bg-white/5 backdrop-blur-sm">
            <PlayCircle className="w-5 h-5" /> View demo
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-4 mb-20">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black bg-indigo-500 flex items-center justify-center text-xs font-bold text-white z-40">A</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black bg-rose-500 flex items-center justify-center text-xs font-bold text-white z-30">M</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black bg-emerald-500 flex items-center justify-center text-xs font-bold text-white z-20">S</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black bg-amber-500 flex items-center justify-center text-xs font-bold text-white z-10">J</div>
          </div>
          <p className="text-sm text-muted-foreground">Loved by 10,000+ creators</p>
        </div>

        {/* Browser mockup */}
        <div className="w-full max-w-[1024px] rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl dark:shadow-[0_30px_100px_rgba(99,102,241,0.15)] overflow-hidden relative bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
          {/* Browser chrome */}
          <div className="h-12 border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2 bg-white/50 dark:bg-black/40 backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="mx-auto w-1/2 h-6 rounded-md border border-black/5 dark:border-white/5 flex items-center justify-center bg-white/80 dark:bg-black/50">
              <span className="text-[11px] text-muted-foreground flex items-center gap-2">
                <LockKey weight="fill" className="w-3 h-3" /> porto.build/yourname
              </span>
            </div>
          </div>

          {/* Mock content */}
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#fdfbf9] via-white to-[#f5f0ec] dark:from-neutral-900 dark:via-neutral-950 dark:to-black p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="w-full h-full border border-black/5 dark:border-white/5 rounded-xl bg-white/40 dark:bg-white/5 flex flex-col p-6 gap-4 relative">
              <div className="flex justify-between items-center w-full mb-8">
                <div className="w-24 h-6 bg-black/10 dark:bg-white/10 rounded-md" />
                <div className="flex gap-4">
                  <div className="w-16 h-4 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="w-16 h-4 bg-black/10 dark:bg-white/10 rounded-md" />
                </div>
              </div>
              <div className="w-3/4 h-12 bg-black/10 dark:bg-white/10 rounded-lg mb-2" />
              <div className="w-1/2 h-12 bg-black/10 dark:bg-white/10 rounded-lg mb-8" />
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg h-full border border-black/5 dark:border-white/5" />
                <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg h-full border border-black/5 dark:border-white/5" />
                <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg h-full border border-black/5 dark:border-white/5" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#fdfbf9] dark:from-black to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
