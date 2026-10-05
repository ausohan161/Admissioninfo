import textData from "@/data/texts.json";

export type TextKey = keyof typeof textData;

/** Mutable on purpose: `applyContent` overwrites these from `content.json` at runtime. */
export const texts: Record<TextKey, string> = { ...textData };

export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((out, [k, v]) => out.split(`{${k}}`).join(v), template);
}
