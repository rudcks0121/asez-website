// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

/**
 * Cloudflare Workers + Static Assets 배포.
 *
 * 페이지는 default로 prerendered (static).
 * src/pages/api/* 안에서 `export const prerender = false;` 한 endpoint만
 * Cloudflare Worker로 dynamic 실행. (현재: /api/auth, /api/callback)
 *
 * Cloudflare 환경 변수 (대시보드에서 설정):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
export default defineConfig({
  output: "static",
  adapter: cloudflare(),
});
