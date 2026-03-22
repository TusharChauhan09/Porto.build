"use client";

import { useState, useEffect } from "react";
import { TemplateCard } from "@/components/template-card";
import { TemplatePreview } from "@/components/template-preview";
import { DEFAULT_PORTFOLIO_DATA } from "@/lib/default-portfolio-data";
import { TEMPLATES } from "@/lib/templates";
import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

// Import only Preview components (not Forms) for live card previews
import Portfolio1 from "@/portfolio-templates/portfolio-1/Portfolio1";
import Portfolio2 from "@/portfolio-templates/portfolio-2/Portfolio2";
import Portfolio3 from "@/portfolio-templates/portfolio-3/Portfolio3";
import Portfolio4 from "@/portfolio-templates/portfolio-4/Portfolio4";
import Portfolio5 from "@/portfolio-templates/portfolio-5/Portfolio5";
import Portfolio6 from "@/portfolio-templates/portfolio-6/Portfolio6";
import Portfolio7 from "@/portfolio-templates/portfolio-7/Portfolio7";
import Portfolio8 from "@/portfolio-templates/portfolio-8/Portfolio8";
import Portfolio9 from "@/portfolio-templates/portfolio-9/Portfolio9";

const TEMPLATE_PREVIEWS: Record<string, React.ComponentType<PortfolioProps>> = {
  template1: Portfolio1,
  template2: Portfolio2,
  template3: Portfolio3,
  template4: Portfolio4,
  template5: Portfolio5,
  template6: Portfolio6,
  template7: Portfolio7,
  template8: Portfolio8,
  template9: Portfolio9,
};

export default function TemplatesPage() {
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/purchase/all")
      .then((res) => res.json())
      .then((json) => {
        if (json.ownedTemplateIds) {
          setOwnedIds(new Set(json.ownedTemplateIds));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-full overflow-auto px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Choose a template to get started with your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {TEMPLATES.map((template) => {
            const Preview = TEMPLATE_PREVIEWS[template.id];
            return (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                price={template.price}
                discount={template.discount}
                owned={template.price === "Free" || ownedIds.has(template.id)}
                previewContent={
                  Preview ? (
                    <TemplatePreview>
                      <Preview {...DEFAULT_PORTFOLIO_DATA} />
                    </TemplatePreview>
                  ) : null
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
