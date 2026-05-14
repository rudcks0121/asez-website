/**
 * Cloudflare Workers entry point.
 *
 * 이 프로젝트는 Cloudflare가 "Workers + Static Assets" 모드로 배포됐기 때문에
 * /functions/ 폴더(Pages Functions 전용)가 자동 인식되지 않음. 그래서 동일한
 * OAuth 처리 로직을 이 단일 _worker.js로 옮겨 Workers entry에 등록.
 *
 * 동작:
 *  - /api/auth      → GitHub OAuth authorize 페이지로 리다이렉트
 *  - /api/callback  → code를 access_token으로 교환 + Decap CMS popup에 전달
 *  - 나머지 모든 경로 → env.ASSETS 바인딩이 정적 파일 서빙
 *
 * Cloudflare 환경 변수: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 * Cloudflare 바인딩: ASSETS (자동 — Workers + Static Assets)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") return handleAuth(request, env, url);
    if (url.pathname === "/api/callback") return handleCallback(request, env, url);

    // 나머지는 정적 자산
    return env.ASSETS.fetch(request);
  },
};

async function handleAuth(request, env, url) {
  const clientId = env.GITHUB_CLIENT_ID;
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
}

async function handleCallback(request, env, url) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) return htmlError("Missing authorization code.");

  const cookieState = getCookie(request.headers.get("Cookie") || "", "oauth_state");
  if (!cookieState || cookieState !== state) {
    return htmlError("OAuth state mismatch. Try logging in again.");
  }

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenResp.json();

  if (tokenData.error || !tokenData.access_token) {
    return htmlError(
      `GitHub error: ${tokenData.error_description || tokenData.error || "no token"}`
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
}

function getCookie(header, name) {
  const m = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function htmlError(message) {
  const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
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
    status: 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
