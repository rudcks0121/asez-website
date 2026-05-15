import type { APIRoute } from "astro";
// @ts-ignore — module exists at runtime in Cloudflare Workers
import { env } from "cloudflare:workers";

/**
 * Newsletter subscription handler.
 * 이메일을 KV에 저장. 대량 발송은 별도 도구(Mailchimp/Resend Broadcasts/Buttondown)와 연동 권장.
 *
 * 추후 외부 서비스 연동 시:
 *   - MAILCHIMP_API_KEY + MAILCHIMP_AUDIENCE_ID
 *   - RESEND_API_KEY (Resend Audiences)
 *   - BUTTONDOWN_API_KEY
 */
export const prerender = false;

interface CfEnv {
  SESSION?: any;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
  MAILCHIMP_DC?: string; // 예: us1, us21
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

  const email = String(payload?.email || "").trim().toLowerCase();
  if (!email || !/^.+@.+\..+$/.test(email) || email.length > 200) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }

  // 1. Mailchimp 연동 (있을 때만)
  if (cfEnv.MAILCHIMP_API_KEY && cfEnv.MAILCHIMP_AUDIENCE_ID && cfEnv.MAILCHIMP_DC) {
    try {
      const url = `https://${cfEnv.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${cfEnv.MAILCHIMP_AUDIENCE_ID}/members`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`anystring:${cfEnv.MAILCHIMP_API_KEY}`)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      });
      // 400 (이미 구독자) 는 success로 처리
      if (res.ok || res.status === 400) {
        return json({ ok: true });
      }
      console.error("Mailchimp error:", res.status, await res.text());
    } catch (err) {
      console.error("Mailchimp exception:", err);
    }
  }

  // 2. KV 저장 fallback
  if (cfEnv.SESSION) {
    try {
      const key = `newsletter:${email}`;
      await cfEnv.SESSION.put(
        key,
        JSON.stringify({ email, subscribedAt: new Date().toISOString() }),
      );
      return json({ ok: true, stored: "kv" });
    } catch (err) {
      console.error("KV store exception:", err);
    }
  }

  // 3. 콘솔 로깅
  console.log("[subscribe] email (no Mailchimp/KV configured):", email);
  return json({ ok: true, stored: "log" });
};
