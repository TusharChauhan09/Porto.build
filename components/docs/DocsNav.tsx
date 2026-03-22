"use client";

import type { LucideIcon } from "lucide-react";

export interface DocSection {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface DocsNavProps {
  sections: DocSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export function DocsNav({ sections, activeSection, onSectionClick }: DocsNavProps) {
  return (
    <nav className="hidden lg:flex w-[220px] flex-shrink-0 flex-col border-r border-border h-full overflow-y-auto">
      <div className="px-5 pt-10 pb-4">
        <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
          On this page
        </p>
      </div>
      <ul className="px-3 space-y-0.5">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors text-left ${
                  isActive
                    ? "text-foreground bg-primary/5 border-l-2 border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border-l-2 border-transparent"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} className={isActive ? "text-primary" : ""} />
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
