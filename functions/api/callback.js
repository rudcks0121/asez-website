/**
 * Decap CMS OAuth: GitHub callback.
 * code → access_token 교환 후 popup → opener(Decap CMS) postMessage로 토큰 전달.
 *
 * 환경 변수: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return htmlError("Missing authorization code.");
  }

  // CSRF state 검증
  const cookieState = getCookie(request.headers.get("Cookie") || "", "oauth_state");
  if (!cookieState || cookieState !== state) {
    return htmlError("OAuth state mismatch. Try logging in again.");
  }

  // code → access_token
  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenResp.json();

  if (tokenData.error || !tokenData.access_token) {
    return htmlError(`GitHub error: ${tokenData.error_description || tokenData.error || "no token"}`);
  }

  // Decap CMS popup ↔ opener 메시지 프로토콜
  const payload = JSON.stringify({
    token: tokenData.access_token,
    provider: "github",
  });
  // CMS는 "authorization:github:success:<json>" 형식의 메시지를 기다림
  const successMessage = `authorization:github:success:${payload}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authorizing…</title>
</head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    // CMS가 "authorizing:github" 보내면 자기 origin 알려준 거 — 거기로 토큰 전달
    if (e.data === "authorizing:github" && e.origin === window.location.origin) {
      window.opener.postMessage(${JSON.stringify(successMessage)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
  }
  if (window.opener) {
    window.addEventListener("message", receiveMessage, false);
    // 부모에게 "준비됐어, origin 알려줘" 신호
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
      // state 쿠키 만료
      "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

function getCookie(header, name) {
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function htmlError(message) {
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
  return new Response(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
