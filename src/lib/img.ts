/**
 * Cloudflare Image Resizing helper.
 *
 * Workers Paid plan ($5+) 이상에서 자동 활성화되는 cdn-cgi/image/ URL 변환을 사용.
 * 원본 이미지가 같은 도메인(또는 Cloudflare-proxied 도메인)에 있어야 동작.
 *
 * 사용법:
 *   <img src={cfImage("/images/foo.jpg", { w: 800, q: 80 })} />
 *
 *   <img
 *     src={cfImage("/images/foo.jpg", { w: 800 })}
 *     srcset={cfSrcset("/images/foo.jpg", [400, 800, 1200])}
 *     sizes="(max-width: 768px) 100vw, 800px"
 *   />
 *
 * 외부 URL(https://...) 이미지는 변환 없이 그대로 반환.
 * /uploads/* 같은 상대 경로는 변환 URL로 감쌈.
 */

export interface CfImageOptions {
  w?: number;       // width
  h?: number;       // height
  q?: number;       // quality 1-100 (default 85)
  fit?: "cover" | "contain" | "scale-down" | "crop" | "pad";
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  gravity?: "auto" | "center" | "north" | "south" | "east" | "west" | "top" | "bottom" | "left" | "right";
  dpr?: number;     // device pixel ratio
  sharpen?: number; // 0-10
}

const DEFAULT_QUALITY = 85;

export function cfImage(src: string, opts: CfImageOptions = {}): string {
  if (!src) return src;
  // 외부 절대 URL은 그대로 반환 (cdn-cgi는 same-origin만 동작)
  if (/^https?:\/\//i.test(src)) return src;
  // data: / blob: 등도 그대로
  if (/^(data|blob):/i.test(src)) return src;

  const parts: string[] = [];
  if (opts.w) parts.push(`width=${opts.w}`);
  if (opts.h) parts.push(`height=${opts.h}`);
  parts.push(`quality=${opts.q ?? DEFAULT_QUALITY}`);
  parts.push(`format=${opts.format ?? "auto"}`);
  if (opts.fit) parts.push(`fit=${opts.fit}`);
  if (opts.gravity) parts.push(`gravity=${opts.gravity}`);
  if (opts.dpr) parts.push(`dpr=${opts.dpr}`);
  if (opts.sharpen != null) parts.push(`sharpen=${opts.sharpen}`);

  const optStr = parts.join(",");
  // path가 /로 시작하지 않으면 추가
  const path = src.startsWith("/") ? src : "/" + src;
  return `/cdn-cgi/image/${optStr}${path}`;
}

/**
 * Responsive srcset 생성.
 * widths: 출력할 너비 배열 (예: [400, 800, 1200])
 */
export function cfSrcset(
  src: string,
  widths: number[],
  opts: Omit<CfImageOptions, "w"> = {},
): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return ""; // 외부 URL은 srcset 미지원
  return widths
    .map((w) => `${cfImage(src, { ...opts, w })} ${w}w`)
    .join(", ");
}

/**
 * 기본 sizes 속성 헬퍼 — 모바일 100vw, 데스크탑 N px
 */
export function defaultSizes(maxWidth = 1200): string {
  return `(max-width: 768px) 100vw, (max-width: 1200px) ${maxWidth}px, ${maxWidth}px`;
}
