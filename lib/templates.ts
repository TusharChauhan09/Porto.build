export interface TemplateConfig {
  id: string;
  name: string;
  /** Display price string, e.g. "Free", "$9" */
  price: string;
  /** Discount percentage, e.g. 20 means 20% off */
  discount?: number;
}

export const TEMPLATES: TemplateConfig[] = [
  { id: "template1", name: "Brutalist", price: "Free" },
  { id: "template2", name: "Cyberpunk", price: "$9", discount: 20 },
  { id: "template3", name: "Designer", price: "$12" },
  { id: "template4", name: "Minimal", price: "Free" },
  { id: "template5", name: "Creative", price: "$15", discount: 30 },
  { id: "template6", name: "Professional", price: "$19" },
  { id: "template7", name: "Terminal", price: "$9", discount: 15 },
  { id: "template8", name: "Bold", price: "Free" },
  { id: "template9", name: "Luxury", price: "$19", discount: 25 },
];

const FREE_TEMPLATE_IDS = new Set(
  TEMPLATES.filter((t) => t.price === "Free").map((t) => t.id)
);

export function isFreeTemplate(templateId: string): boolean {
  return FREE_TEMPLATE_IDS.has(templateId);
}

export function getTemplateConfig(
  templateId: string
): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === templateId);
}

export function getDiscountedPrice(template: TemplateConfig): string | null {
  if (!template.discount || template.price === "Free") return null;
  const numeric = parseFloat(template.price.replace("$", ""));
  if (isNaN(numeric)) return null;
  return `$${Math.round(numeric - (numeric * template.discount) / 100)}`;
}
