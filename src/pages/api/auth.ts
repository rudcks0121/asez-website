import type { APIRoute } from "astro";

/**
 * Decap CMS OAuth — 1단계: GitHub authorize 페이지로 리다이렉트.
 *
 * 이 endpoint는 dynamic이므로 prerender = false.
 * Astro의 Cloudflare adapter가 Workers Function으로 빌드.
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const runtime = (locals as any).runtime;
    const env = runtime?.env as { GITHUB_CLIENT_ID?: string } | undefined;
    const clientId = env?.GITHUB_CLIENT_ID;

    // 진단: runtime 객체가 있는지 + env key 목록
    if (!runtime) {
      return debugResponse("locals.runtime is undefined", {
        localsKeys: Object.keys(locals || {}),
      });
    }
    if (!env) {
      return debugResponse("runtime.env is undefined", {
        runtimeKeys: Object.keys(runtime),
      });
    }
    if (!clientId) {
      return debugResponse("GITHUB_CLIENT_ID env var missing", {
        availableEnvKeys: Object.keys(env),
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
      `Caught error in /api/auth:\n${err?.message || String(err)}\n\nStack:\n${err?.stack || "(no stack)"}`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
};

function debugResponse(message: string, detail: Record<string, unknown>) {
  return new Response(
    `${message}\n\n${JSON.stringify(detail, null, 2)}`,
    { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
