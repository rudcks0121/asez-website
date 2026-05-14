import type { APIRoute } from "astro";

/**
 * Decap CMS OAuth — 1단계: GitHub authorize 페이지로 리다이렉트.
 *
 * 이 endpoint는 dynamic이므로 prerender = false.
 * Astro의 Cloudflare adapter가 Workers Function으로 빌드.
 */
export const prerender = false;

export const GET: APIRoute = async ({ request, locals, url }) => {
  // Cloudflare adapter는 env를 locals.runtime.env로 노출
  const env = (locals as any).runtime?.env as
    | { GITHUB_CLIENT_ID?: string }
    | undefined;
  const clientId = env?.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID env var", { status: 500 });
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
};
