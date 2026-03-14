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
      className="w-full flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm py-3.5 px-5 rounded-xl border border-zinc-200/80 shadow-sm text-zinc-800 text-sm font-semibold hover:bg-white/80 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 cursor-pointer"
    >
      {icon}
      {label}
    </button>
  );
}
