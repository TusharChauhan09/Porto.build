"use client";

import Link from "next/link";

export function CTA({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="pricing" className="py-24 bg-transparent dark:bg-black border-t border-black/5 dark:border-white/[0.06] relative overflow-hidden">
      {/* Glow — dark mode only */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-transparent dark:bg-brand/10 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-[768px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-6 text-foreground">
          Ready to stand out?
        </h2>
        <p className="text-base text-muted-foreground mb-10 max-w-[500px] mx-auto">
          Join thousands of creatives building their internet home on Porto. Start for free, upgrade when you need more power.
        </p>

        <Link
          href={isLoggedIn ? "/arena/docs" : "/auth/signin"}
          className="inline-block bg-brand text-white text-base font-semibold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-brand-hover hover:-translate-y-[2px] transition-all duration-300"
        >
          Create your portfolio
        </Link>
      </div>
    </section>
  );
}
