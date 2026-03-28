"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CirclesThree, Sun, Moon } from "@phosphor-icons/react";

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
        <div className="flex items-center gap-2">
          <CirclesThree weight="fill" className="text-brand text-2xl w-7 h-7" />
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
          <Link
            href={isLoggedIn ? "/arena/docs" : "/auth/signin"}
            className="bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-xl hover:-translate-y-[1px] hover:shadow-lg transition-all"
          >
            {isLoggedIn ? "Go to Arena" : "Get Started"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
