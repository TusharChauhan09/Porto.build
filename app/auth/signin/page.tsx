"use client";

import { signIn } from "@/lib/auth-client";
import { AuthButton } from "@/components/auth/AuthButton";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { GitHubIcon } from "@/components/auth/GitHubIcon";
import { GradientBackground } from "@/components/auth/GradientBackground";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fdfbf9] dark:bg-black selection:bg-zinc-200 dark:selection:bg-white/10">
      <GradientBackground />

      <div className="relative z-10 w-full max-w-sm px-4 sm:px-0">
        <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-in-up px-7 sm:px-10 py-10 sm:py-12 border border-white/40 dark:border-white/[0.08] ring-1 ring-zinc-900/5 dark:ring-white/5">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20 pointer-events-none rounded-[inherit]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="font-serif text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight">
              Welcome to Porto<span className="italic">.build</span>
            </h1>

            <p className="text-sm text-zinc-500 dark:text-white/50 mt-2 font-sans">
              Build your portfolio in minutes.
            </p>

            <div className="mt-8 flex flex-col gap-3 w-full">
              <AuthButton
                icon={<GoogleIcon className="w-5 h-5 shrink-0" />}
                label="Continue with Google"
                onClick={() =>
                  signIn.social({
                    provider: "google",
                    callbackURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/arena/docs`,
                  })
                }
              />

              <AuthButton
                icon={<GitHubIcon className="w-5 h-5 shrink-0" />}
                label="Continue with GitHub"
                onClick={() =>
                  signIn.social({
                    provider: "github",
                    callbackURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""}/arena/docs`,
                  })
                }
              />
            </div>

            <p className="mt-6 text-xs text-zinc-400 dark:text-white/30 w-full sm:max-w-[280px] mx-auto leading-relaxed">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-4 decoration-zinc-300 dark:decoration-white/20 hover:decoration-zinc-600 dark:hover:decoration-white/50 hover:text-zinc-600 dark:hover:text-white/60 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-4 decoration-zinc-300 dark:decoration-white/20 hover:decoration-zinc-600 dark:hover:decoration-white/50 hover:text-zinc-600 dark:hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
