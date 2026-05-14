import { ui, defaultLang, type Lang, type UIKey } from "./ui";

/**
 * URL pathname에서 현재 언어 추출.
 * /ko/ 또는 /ko로 시작하면 'ko', 아니면 영문(default).
 */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split("/");
  if (first === "ko") return "ko";
  return defaultLang as Lang;
}

/**
 * 현재 언어에 맞는 번역 함수 생성.
 * 사용: const t = useTranslations(Astro.url); t("nav.about")
 */
export function useTranslations(url: URL) {
  const lang = getLangFromUrl(url);
  return function t(key: UIKey): string {
    return ui[lang][key] || ui[defaultLang as Lang][key] || key;
  };
}

/**
 * 언어 토글: 같은 페이지의 반대 언어 경로를 반환.
 * /about → /ko/about
 * /ko/about → /about
 */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const path = url.pathname;
  const currentLang = getLangFromUrl(url);
  if (currentLang === targetLang) return path;

  if (targetLang === "ko") {
    // en → ko: /about → /ko/about, / → /ko/
    if (path === "/") return "/ko/";
    return `/ko${path}`;
  } else {
    // ko → en: /ko/about → /about, /ko/ → /
    const stripped = path.replace(/^\/ko/, "") || "/";
    return stripped;
  }
}

/**
 * 언어 prefix 포함한 URL 생성.
 * en: pathLocalized("/about") → "/about"
 * ko: pathLocalized("/about") → "/ko/about"
 */
export function pathLocalized(path: string, lang: Lang): string {
  if (lang === "ko") {
    if (path === "/") return "/ko/";
    return `/ko${path}`;
  }
  return path;
}
