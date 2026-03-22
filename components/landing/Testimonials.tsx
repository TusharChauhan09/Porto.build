"use client";

const testimonials = [
  {
    initials: "SM",
    name: "Sarah Miller",
    role: "Product Designer",
    color: "bg-indigo-500",
    quote:
      "\u201cI rebuilt my portfolio in a single afternoon. The templates are gorgeous out of the box, and the editor gets out of your way.\u201d",
  },
  {
    initials: "JD",
    name: "James Doe",
    role: "Frontend Engineer",
    color: "bg-emerald-500",
    quote:
      "\u201cI usually code my own sites, but Porto gave me the exact result I wanted in 1/10th the time. The CV feature is genius.\u201d",
  },
  {
    initials: "EL",
    name: "Elena L.",
    role: "Creative Director",
    color: "bg-rose-500",
    quote:
      "\u201cFinally, a tool that understands typography and spacing. It feels like a design tool, not just a clunky website builder.\u201d",
  },
  {
    initials: "MW",
    name: "Marcus Wright",
    role: "Freelance Writer",
    color: "bg-amber-500",
    quote:
      "\u201cThe simplest way to look professional online. I linked my custom domain in seconds and had my first client inquiry the next day.\u201d",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 border-t border-black/5 dark:border-white/[0.06] bg-transparent dark:bg-black">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[40px] font-semibold tracking-tight text-foreground">
            Don&apos;t just take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.initials} className="shimmer-wrapper">
              <div className="shimmer-inner p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground leading-tight">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 dark:text-[#d4d4d4] leading-relaxed italic">{t.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
