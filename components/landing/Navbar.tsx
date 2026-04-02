"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center transition-all duration-300 border-b border-black/[0.04] dark:border-white/[0.06] bg-[#fdfbf9]/80 dark:bg-black/80 backdrop-blur-xl ${
        scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-[0.2px]">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="text-brand mt-2">
            <path d="M16 2L12.5 4L12.5 8L16 10L19.5 8L19.5 4Z" fill="currentColor" />
            <path d="M11 11L7.5 13L7.5 17L11 19L14.5 17L14.5 13Z" fill="currentColor" />
            <path d="M21 11L17.5 13L17.5 17L21 19L24.5 17L24.5 13Z" fill="currentColor" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Porto<span className="font-serif italic text-muted-foreground font-normal">.build</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun weight="bold" className="w-4 h-4" /> : <Moon weight="bold" className="w-4 h-4" />)}
          </button>
          {!isLoggedIn && (
            <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block">
              Log in
            </Link>
          )}
          <div className="rounded-[13px] border border-dashed border-foreground/25 dark:border-foreground/20 p-[2px]">
            <Link
              href={isLoggedIn ? "/arena/templates" : "/auth/signin"}
              className="block bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-[11px] transition-colors duration-200"
            >
              {isLoggedIn ? "Start build" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
