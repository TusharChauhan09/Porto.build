"use client";

import { ReactNode } from "react";

interface AuthButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export function AuthButton({ icon, label, onClick }: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm py-3.5 px-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-none text-zinc-800 dark:text-white/90 text-sm font-semibold hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-md dark:hover:shadow-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-white/20 focus:ring-offset-2 dark:focus:ring-offset-black cursor-pointer"
    >
      {icon}
      {label}
    </button>
  );
}
