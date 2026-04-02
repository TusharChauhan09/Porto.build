"use client";

import { useRouter } from "next/navigation";

interface TemplateCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  owned?: boolean;
  preview?: string;
  previewContent?: React.ReactNode;
}

export function TemplateCard({ id, name, price, originalPrice, discount, owned, preview, previewContent }: TemplateCardProps) {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/arena/templates/${id}`)} className="block cursor-pointer">
      <div className="group relative w-full h-[420px] p-3 border border-dashed border-zinc-800 hover:border-zinc-500 transition-colors duration-300 flex flex-col cursor-pointer bg-background">
        {/* Corner accents */}
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-transparent group-hover:border-zinc-600 transition-colors duration-300" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-transparent group-hover:border-zinc-600 transition-colors duration-300" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-transparent group-hover:border-zinc-600 transition-colors duration-300" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-transparent group-hover:border-zinc-600 transition-colors duration-300" />

        {/* Preview area */}
        <div className="w-full grow bg-secondary rounded-lg overflow-hidden relative mb-4" style={{ contain: "layout style paint" }}>
          <div className="absolute inset-0 border border-white/5 rounded-lg z-10 pointer-events-none" />
          {previewContent
            ? previewContent
            : preview && (
                <img
                  src={preview}
                  alt={`${name} template preview`}
                  className="w-full h-full object-cover object-top"
                />
              )}
        </div>

        {/* Name and price */}
        <div className="flex justify-between items-end px-1 pb-1 mt-auto">
          <h2 className="text-foreground font-medium text-lg tracking-tight group-hover:text-foreground transition-colors duration-300">
            {name}
          </h2>
          <div className="flex items-center gap-2 font-mono text-sm mb-0.5">
            {originalPrice ? (
              <>
                <span className="text-muted-foreground/50 line-through decoration-muted-foreground/50 text-sm">
                  {originalPrice}
                </span>
                <span className="text-emerald-500 font-medium text-sm">
                  Free
                </span>
              </>
            ) : (
              <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                <span className="text-lg">{price}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
