import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Stories collection — Astro v6 형식.
 * 새 스토리 추가: src/content/stories/{slug}.md 파일 생성.
 */
const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    pillBg: z.string().default("var(--brand-50)"),
    pillColor: z.string().default("var(--brand-900)"),
    location: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stories };
