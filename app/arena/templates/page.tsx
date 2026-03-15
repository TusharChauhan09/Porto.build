import { TemplateCard } from "@/components/template-card";

const templates = [
  { name: "Starter", price: "Free" },
  { name: "Developer", price: "$9", discount: 20 },
  { name: "Designer", price: "$12" },
  { name: "Minimal", price: "Free" },
  { name: "Creative", price: "$15", discount: 30 },
  { name: "Professional", price: "$19" },
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
          {templates.map((template) => (
            <TemplateCard
              key={template.name}
              name={template.name}
              price={template.price}
              discount={template.discount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
