"use client";

interface TemplateCardProps {
  name: string;
  price: string;
  discount?: number;
}

export function TemplateCard({ name, price, discount }: TemplateCardProps) {
  const numericPrice = parseFloat(price.replace("$", ""));
  const hasDiscount = discount != null && discount > 0 && !isNaN(numericPrice);
  const discountedPrice = hasDiscount
    ? `$${Math.round(numericPrice - (numericPrice * discount) / 100)}`
    : null;

  return (
    <div className="group relative w-full h-[420px] p-3 border border-dashed border-zinc-800 hover:border-zinc-500 transition-colors duration-300 flex flex-col cursor-pointer bg-background">
      {/* Corner accents */}
      <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-300 group-hover:border-zinc-600 transition-colors duration-300" />
      <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-300 group-hover:border-zinc-600 transition-colors duration-300" />
      <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-300 group-hover:border-zinc-600 transition-colors duration-300" />
      <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-300 group-hover:border-zinc-600 transition-colors duration-300" />

      {/* Empty preview area */}
      <div className="w-full flex-grow bg-secondary rounded-lg overflow-hidden relative mb-4">
        <div className="absolute inset-0 border border-white/5 rounded-lg z-10 pointer-events-none" />
      </div>

      {/* Name and price */}
      <div className="flex justify-between items-end px-1 pb-1 mt-auto">
        <h2 className="text-foreground font-medium text-lg tracking-tight group-hover:text-foreground transition-colors duration-300">
          {name}
        </h2>
        <div className="flex items-center gap-2 font-mono text-sm mb-0.5">
          {hasDiscount ? (
            <>
              <span className="text-muted-foreground/50 line-through decoration-muted-foreground/50">
                {price}
              </span>
              <span className="text-foreground group-hover:text-foreground transition-colors duration-300">
                {discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
