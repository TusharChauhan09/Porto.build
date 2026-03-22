export function Footer() {
  return (
    <footer className="bg-black pt-16 pb-8 relative ove
    rflow-hidden">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center pt-12 pb-8">
          {/* Large outlined text with bottom mask */}
          <div className="relative w-full flex justify-center select-none">
            <span
              className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold tracking-tight leading-none text-center"
              style={{
                WebkitTextFillColor: "#000000",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                paintOrder: "stroke fill",
                letterSpacing: "-0.04em",
              }}
            >
              PORTO.BUILD
            </span>
            {/* Bottom masking gradient */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-8 pt-6 border-t border-white/5 w-full max-w-[800px]">
            <p className="text-[11px] tracking-[0.15em] text-[#525252] uppercase">
              © 2024 PORTO.BUILD
            </p>
            <p className="text-[11px] tracking-[0.15em] text-[#525252] uppercase">
              BUILT FOR CREATIVES, BY CREATIVES
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
