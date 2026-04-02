"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center border-b border-black/5 dark:border-white/[0.06]">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid z-0" />

      {/* Glow — only in dark mode */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-transparent dark:bg-brand/20 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center w-full">
        {/* Badge */}
        {/* <div className="p-[2px] rounded-full bg-linear-to-r from-brand/40 via-brand/20 to-brand/40 dark:from-brand/50 dark:via-brand/20 dark:to-brand/50">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-dashed border-brand/30 dark:border-brand/40 bg-[#fdfbf9] dark:bg-neutral-950 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-brand" />
              <div className="absolute w-2 h-2 rounded-full bg-brand animate-ping" />
            </div>
            <span className="text-xs font-semibold text-brand tracking-wider">Beta</span>
          </div>
        </div> */}

        {/* Heading with gradient mask */}
        <h1 className="text-[56px] md:text-[72px] font-bold tracking-tight leading-[1.1] max-w-[768px] mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/40">
            Craft your perfect portfolio
          </span>
          <br className="hidden md:block" />
          <span className="font-serif italic font-normal text-foreground">
            effortlessly.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-muted-foreground max-w-[500px] leading-relaxed">
          Build, manage, and deploy stunning personal sites in minutes. No coding required. Just your best work, presented beautifully.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 pt-8 border-black/10 dark:border-white/10">
          {/* Primary button — deep slate */}
          <div className="rounded-[13px] border border-dashed border-slate-400/40 dark:border-slate-500/30 p-[2px] w-full sm:w-auto">
            <Link
              href={isLoggedIn ? "/arena/templates" : "/auth/signin"}
              className="block bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-base font-semibold px-6 py-3 rounded-[11px] transition-colors duration-200 text-center hover:bg-slate-800 dark:hover:bg-white"
            >
              Start building free
            </Link>
          </div>

          {/* Secondary button — muted slate glass */}
          <div className="rounded-[13px] border border-dashed border-slate-300/60 dark:border-slate-600/40 p-[2px] w-full sm:w-auto">
            <Link
              href="/arena/docs"
              className="text-slate-700 dark:text-slate-300 text-base font-semibold px-6 py-3 rounded-[11px] transition-colors duration-200 w-full flex items-center justify-center gap-2 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <FileText className="w-4 h-4" /> Docs
            </Link>
          </div>
        </div>

        {/* Social proof — real people avatars */}
        <div className="flex items-center gap-4 mb-20">
          <div className="flex -space-x-3">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Creator" className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black object-cover z-40" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Creator" className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black object-cover z-30" />
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Creator" className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black object-cover z-20" />
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Creator" className="w-8 h-8 rounded-full border-2 border-[#fdfbf9] dark:border-black object-cover z-10" />
          </div>
          <p className="text-sm text-muted-foreground">Loved by 100+ creators</p>
        </div>

        {/* Browser mockup */}
        <div className="w-full max-w-[1024px] rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl dark:shadow-[0_30px_100px_rgba(99,102,241,0.2)] overflow-hidden relative bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
          {/* Browser chrome */}
          <div className="h-12 border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2 bg-white/50 dark:bg-black/40 backdrop-blur-sm">
            <div className="w-3 h-3 bg-rose-500/80" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }} />
            <div className="w-3 h-3 bg-amber-500/80" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }} />
            <div className="w-3 h-3 bg-emerald-500/80" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }} />
            <div className="mx-auto w-1/2 h-6 rounded-md border border-black/5 dark:border-white/5 flex items-center justify-center bg-white/80 dark:bg-black/50">
              <span className="text-[11px] text-muted-foreground flex items-center gap-2">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
                porto.build/yourname
              </span>
            </div>
          </div>

          {/* Screenshot */}
          <div className="relative w-full overflow-hidden">
            <img
              src="/image.png"
              alt="Porto.build app preview"
              className="w-full h-auto block"
            />
            {/* Bottom fade mask */}
            <div className="absolute bottom-0 left-0 w-full h-2/5 bg-linear-to-t from-[#fdfbf9] dark:from-neutral-950 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
