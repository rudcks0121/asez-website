import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Stories — 필드 스토리, 뉴스, 프레스 릴리스.
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

/**
 * Reports — 연간 보고서, SDG, 리서치, 정책 페이퍼.
 * 본문은 선택 (짧은 요약/맥락). PDF 자체가 메인 콘텐츠.
 */
const reports = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reports" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["Annual report", "SDG progress", "Research brief", "Policy paper"]),
    date: z.coerce.date(),
    pages: z.number(),
    excerpt: z.string(),
    pdfUrl: z.string().default("#"),
    pillBg: z.string().default("var(--brand-50)"),
    pillColor: z.string().default("var(--brand-900)"),
    draft: z.boolean().default(false),
  }),
});

/**
 * Events — 다가오는/지난 포럼, 서밋, 캠페인.
 */
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["Forum", "Summit", "Campaign", "Conference", "Workshop"]),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    excerpt: z.string(),
    registrationUrl: z.string().default("#"),
    pillBg: z.string().default("var(--brand-50)"),
    pillColor: z.string().default("var(--brand-900)"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stories, reports, events };
