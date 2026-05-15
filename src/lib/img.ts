/**
 * Cloudflare Image Resizing helper.
 *
 * Workers Paid plan + 커스텀 도메인 + Image Resizing 활성화 시 동작.
 * workers.dev 도메인에서는 /cdn-cgi/image/ 변환을 지원 안 함 → 비활성화.
 *
 * 커스텀 도메인 연결 후:
 *   1. Cloudflare Dashboard → 해당 zone → Speed → Optimization → Image Resizing 활성화
 *   2. 아래 CF_IMAGES_ENABLED를 true로 변경
 *
 * 비활성화 상태에서도 함수는 src를 그대로 반환하므로 사용처 코드는 그대로.
 */

// 도메인 이전 시 true로 변경 — Image Resizing 활성화된 zone 필요.
const CF_IMAGES_ENABLED = false;

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
  // 도메인 이전 전까지는 원본 그대로
  if (!CF_IMAGES_ENABLED) return src;
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
): string | undefined {
  if (!src) return undefined;
  if (!CF_IMAGES_ENABLED) return undefined;
  if (/^https?:\/\//i.test(src)) return undefined; // 외부 URL은 srcset 미지원
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
