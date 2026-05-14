import type { APIRoute } from "astro";
// @ts-ignore — module exists at runtime in Cloudflare Workers
import { env } from "cloudflare:workers";

/**
 * Decap CMS OAuth — 1단계: GitHub authorize 페이지로 리다이렉트.
 * Astro v6 + Cloudflare adapter — env는 cloudflare:workers에서 import.
 */
export const prerender = false;

interface CfEnv {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}
const cfEnv = env as CfEnv;

export const GET: APIRoute = async ({ url }) => {
  try {
    const clientId = cfEnv.GITHUB_CLIENT_ID;
    if (!clientId) {
      return new Response("Missing GITHUB_CLIENT_ID env var", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const redirectUri = `${url.origin}/api/callback`;
    const state = crypto.randomUUID();

    const ghUrl = new URL("https://github.com/login/oauth/authorize");
    ghUrl.searchParams.set("client_id", clientId);
    ghUrl.searchParams.set("redirect_uri", redirectUri);
    ghUrl.searchParams.set("scope", "repo,user");
    ghUrl.searchParams.set("state", state);

    return new Response(null, {
      status: 302,
      headers: {
        Location: ghUrl.toString(),
        "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      },
    });
  } catch (err: any) {
    return new Response(
      `auth error: ${err?.message || String(err)}\n${err?.stack || ""}`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
};
