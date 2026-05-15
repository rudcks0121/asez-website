import type { APIRoute } from "astro";
// @ts-ignore — module exists at runtime in Cloudflare Workers
import { env } from "cloudflare:workers";

/**
 * Contact form submission handler.
 * 우선순위:
 *   1. RESEND_API_KEY 있으면 Resend로 이메일 발송
 *   2. 없으면 KV(SESSION 또는 별도 binding)에 저장
 *   3. 둘 다 없으면 콘솔 로깅 + 200 응답 (개발 모드)
 *
 * Cloudflare 대시보드에서 RESEND_API_KEY, CONTACT_TO, CONTACT_FROM secret 설정 필요.
 */
export const prerender = false;

interface CfEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  SESSION?: any; // KV namespace
}
const cfEnv = env as CfEnv;

const json = (body: any, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const { name, email, subject, message } = payload || {};

  // 기본 검증
  if (!email || typeof email !== "string" || !/^.+@.+\..+$/.test(email)) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }
  if (!message || typeof message !== "string" || message.length < 2) {
    return json({ ok: false, error: "Message required" }, 400);
  }
  if (message.length > 5000) {
    return json({ ok: false, error: "Message too long" }, 400);
  }

  const submission = {
    name: String(name || "").slice(0, 120),
    email: String(email).slice(0, 200),
    subject: String(subject || "").slice(0, 200),
    message: String(message).slice(0, 5000),
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || "",
  };

  // 1. Resend로 이메일 발송
  if (cfEnv.RESEND_API_KEY) {
    try {
      const to = cfEnv.CONTACT_TO || "contact@asez.org";
      const from = cfEnv.CONTACT_FROM || "ASEZ Website <no-reply@asez.org>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cfEnv.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: submission.email,
          subject: `[ASEZ] ${submission.subject || "Website inquiry"} — ${submission.name || submission.email}`,
          text: [
            `From: ${submission.name} <${submission.email}>`,
            `Subject: ${submission.subject || "(none)"}`,
            `Submitted: ${submission.submittedAt}`,
            "",
            submission.message,
          ].join("\n"),
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Resend error:", res.status, errText);
        // Resend가 실패해도 KV에는 저장 (아래로 진행)
      } else {
        return json({ ok: true });
      }
    } catch (err) {
      console.error("Resend exception:", err);
    }
  }

  // 2. KV 저장 fallback
  if (cfEnv.SESSION) {
    try {
      const key = `contact:${submission.submittedAt}:${crypto.randomUUID()}`;
      await cfEnv.SESSION.put(key, JSON.stringify(submission), {
        expirationTtl: 60 * 60 * 24 * 90, // 90 days
      });
      return json({ ok: true, stored: "kv" });
    } catch (err) {
      console.error("KV store exception:", err);
    }
  }

  // 3. 콘솔 로깅 (개발 모드)
  console.log("[contact] submission (no Resend/KV configured):", submission);
  return json({ ok: true, stored: "log" });
};
