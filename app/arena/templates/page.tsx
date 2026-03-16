"use client";

import { TemplateCard } from "@/components/template-card";
import { TemplatePreview } from "@/components/template-preview";
import { DEFAULT_PORTFOLIO_DATA } from "@/lib/default-portfolio-data";
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

const templates: {
  id: string;
  name: string;
  price: string;
  discount?: number;
  Preview: React.ComponentType<PortfolioProps>;
}[] = [
  { id: "template1", name: "Brutalist", price: "Free", Preview: Portfolio1 },
  { id: "template2", name: "Cyberpunk", price: "$9", discount: 20, Preview: Portfolio2 },
  { id: "template3", name: "Designer", price: "$12", Preview: Portfolio3 },
  { id: "template4", name: "Minimal", price: "Free", Preview: Portfolio4 },
  { id: "template5", name: "Creative", price: "$15", discount: 30, Preview: Portfolio5 },
  { id: "template6", name: "Professional", price: "$19", Preview: Portfolio6 },
  { id: "template7", name: "Terminal", price: "$9", discount: 15, Preview: Portfolio7 },
  { id: "template8", name: "Bold", price: "Free", Preview: Portfolio8 },
  { id: "template9", name: "Luxury", price: "$19", discount: 25, Preview: Portfolio9 },
];

export default function TemplatesPage() {
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
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              price={template.price}
              discount={template.discount}
              previewContent={
                <TemplatePreview delay={index * 2}>
                  <template.Preview {...DEFAULT_PORTFOLIO_DATA} />
                </TemplatePreview>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
