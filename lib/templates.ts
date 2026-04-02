export interface TemplateConfig {
  id: string;
  name: string;
  /** Display price string, e.g. "Free", "$9" */
  price: string;
  /** Original price before being made free, shown as strikethrough */
  originalPrice?: string;
  /** Discount percentage, e.g. 20 means 20% off */
  discount?: number;
}

export const TEMPLATES: TemplateConfig[] = [
  { id: "template1", name: "Brutalist", price: "Free" },
  { id: "template2", name: "Cyberpunk", price: "Free" },
  { id: "template3", name: "Designer", price: "Free" },
  { id: "template4", name: "Minimal", price: "Free" },
  { id: "template5", name: "Creative", price: "Free" },
  { id: "template6", name: "Professional", price: "Free", originalPrice: "₹59" },
  { id: "template7", name: "Terminal", price: "Free", originalPrice: "₹59" },
  { id: "template8", name: "Bold", price: "Free", originalPrice: "₹59" },
  { id: "template9", name: "Luxury", price: "Free", originalPrice: "₹59" },
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
  const numeric = parseFloat(template.price.replace(/[₹$]/g, ""));
  if (isNaN(numeric)) return null;
  const symbol = template.price.startsWith("₹") ? "₹" : "$";
  return `${symbol}${Math.round(numeric - (numeric * template.discount) / 100)}`;
}
