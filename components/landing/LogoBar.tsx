"use client";

import {
  FigmaLogo,
  StripeLogo,
  FramerLogo,
  GithubLogo,
  NotionLogo,
} from "@phosphor-icons/react";

const logos = [
  { Icon: FigmaLogo, name: "DesignCo" },
  { Icon: StripeLogo, name: "PaymentsInc" },
  { Icon: FramerLogo, name: "WebFlow" },
  { Icon: GithubLogo, name: "DevCorp" },
  { Icon: NotionLogo, name: "NotesApp" },
];

export function LogoBar() {
  return (
    <section className="py-12 border-b border-black/5 dark:border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-8">
          Powering portfolios for teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 dark:opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map(({ Icon, name }) => (
            <div key={name} className="flex items-center text-foreground">
              <Icon weight="fill" className="w-8 h-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
