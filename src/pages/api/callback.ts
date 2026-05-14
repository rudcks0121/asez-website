import type { APIRoute } from "astro";

/**
 * Decap CMS OAuth — 2단계: GitHub callback.
 * code → access_token 교환 후, opener(Decap CMS popup)에 postMessage로 토큰 전달.
 */
export const prerender = false;

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

interface TokenResp {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export const GET: APIRoute = async ({ request, locals, url }) => {
  const env = (locals as any).runtime?.env as Env | undefined;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) return htmlError("Missing authorization code.", 400);

  const cookieState = getCookie(request.headers.get("Cookie") || "", "oauth_state");
  if (!cookieState || cookieState !== state) {
    return htmlError("OAuth state mismatch. Try logging in again.", 400);
  }

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env?.GITHUB_CLIENT_ID,
      client_secret: env?.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = (await tokenResp.json()) as TokenResp;

  if (tokenData.error || !tokenData.access_token) {
    return htmlError(
      `GitHub error: ${tokenData.error_description || tokenData.error || "no token"}`,
      400
    );
  }

  const payload = JSON.stringify({
    token: tokenData.access_token,
    provider: "github",
  });
  const successMessage = `authorization:github:success:${payload}`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    if (e.data === "authorizing:github" && e.origin === window.location.origin) {
      window.opener.postMessage(${JSON.stringify(successMessage)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
  }
  if (window.opener) {
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  } else {
    document.body.innerText = "No opener window. Close this tab and try again.";
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
};

function getCookie(header: string, name: string): string | null {
  const m = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function htmlError(message: string, status = 400): Response {
  const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
    );
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Auth error</title>
<style>body{font-family:system-ui,sans-serif;padding:40px;color:#333}h1{color:#c00}</style>
</head>
<body>
<h1>OAuth failed</h1>
<p>${escape(message)}</p>
<p><a href="/admin">Return to /admin</a></p>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
