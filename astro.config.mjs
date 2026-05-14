// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

/**
 * Cloudflare Workers + Static Assets 배포 + i18n SEO.
 *
 * - `site`: canonical / sitemap / OG URL의 기준이 되는 절대 URL.
 *   커스텀 도메인 연결 시 이 값만 변경.
 * - sitemap: 모든 페이지를 자동으로 sitemap.xml에 등록 (i18n alternate 포함).
 * - 페이지는 default로 prerendered. /api/* 만 dynamic Worker.
 */
export default defineConfig({
  site: "https://asez-website.rudcks0121.workers.dev",
  output: "static",
  adapter: cloudflare(),
  integrations: [
    sitemap({
      // /admin과 /api/*는 sitemap에서 제외 (검색 노출 X)
      filter: (page) => !page.includes("/admin") && !page.includes("/api/"),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", ko: "ko-KR" },
      },
    }),
  ],
});
