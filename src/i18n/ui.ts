/**
 * 다국어 텍스트 사전 (UI 카피).
 * 컬렉션 콘텐츠(스토리/이슈 본문)는 별도 관리.
 */

export const languages = {
  en: "English",
  ko: "한국어",
} as const;

export const defaultLang = "en";
export type Lang = keyof typeof languages;

export const ui = {
  en: {
    /* Nav */
    "nav.about": "About",
    "nav.what-we-do": "What we do",
    "nav.where-we-work": "Where we work",
    "nav.stories": "Stories",
    "nav.reports": "Reports",
    "nav.get-involved": "Get involved",

    /* Hero */
    "hero.eyebrow": "Save the Earth from A to Z",
    "hero.title.line1": "University students,",
    "hero.title.line2": "changing the world.",
    "hero.lead":
      "A global network of 7,500 campuses across 175 countries — protecting the environment, supporting communities, and shaping a more livable future for the next generation.",
    "hero.cta.primary": "Join ASEZ",
    "hero.cta.secondary": "See our impact",

    /* Catchphrase */
    "catchphrase.eyebrow": "What we're changing",
    "catchphrase.line":
      "Turning student energy into <strong>safer streets</strong>, <strong>greener cities</strong>, <strong>stronger communities</strong>, and <strong>faster crisis response</strong> — in 175 countries, every day.",

    /* Stats */
    "stats.eyebrow": "Our global footprint",
    "stats.title": "A movement, in numbers.",
    "stats.countries": "Countries",
    "stats.campuses": "Campuses",
    "stats.hours": "Volunteer hours",
    "stats.sdgs": "UN SDGs supported",

    /* Major projects */
    "projects.eyebrow": "Major projects",
    "projects.title": "Four pillars of ASEZ's work.",
    "projects.intro":
      "All ASEZ activities are organized around four flagship programs — each addressing a defining challenge of our generation.",
    "projects.all": "All issues",
    "projects.learn-more": "Learn more",
    "projects.crime.title": "Crime Prevention",
    "projects.crime.tagline": "We make a safe world.",
    "projects.crime.desc":
      "Reduce Crime Together — applying the Broken Windows theory to build safer streets, schools, and campuses.",
    "projects.climate.title": "Climate Change Response",
    "projects.climate.tagline": "We create a sustainable world.",
    "projects.climate.desc":
      "Blue Carbon, tree planting, Zero Plastic 2040, and policy engagement at UN climate forums.",
    "projects.community.title": "Community Service",
    "projects.community.tagline": "We foster an inclusive world.",
    "projects.community.desc":
      "Volunteering with neighbors, schools, and local NGOs — supporting the people closest to home.",
    "projects.emergency.title": "Emergency Relief",
    "projects.emergency.tagline": "We build a resilient world.",
    "projects.emergency.desc":
      "Rapid response and long-term recovery in earthquake, flood, storm, and conflict-affected regions.",

    /* Activity by region */
    "region.eyebrow": "Activity by region",
    "region.title": "Local action, global movement.",
    "region.intro":
      "ASEZ chapters are organized regionally. Here's what's happening on each continent right now.",
    "region.full-map": "Full map",
    "region.countries": "countries",
    "region.asia": "Asia",
    "region.americas": "Americas",
    "region.europe": "Europe",
    "region.africa": "Africa",
    "region.oceania": "Oceania",

    /* Recognition */
    "recognition.eyebrow": "Recognition",
    "recognition.title": "Honored globally. Trusted broadly.",
    "recognition.see-all": "See all recognition",
    "recognition.awards.num": "12+",
    "recognition.awards.label": "International awards",
    "recognition.awards.sub":
      "UNCCD, U.S. Presidency, Green Apple Awards, and more.",
    "recognition.partnerships.num": "80+",
    "recognition.partnerships.label": "Partnerships & MOUs",
    "recognition.partnerships.sub":
      "UN agencies, governments, universities, and global NGOs.",

    /* Stories on home */
    "stories.eyebrow": "Field stories",
    "stories.title": "Latest from the field.",
    "stories.view-all": "All stories",

    /* Video */
    "videos.eyebrow": "Video",
    "videos.title": "Watch our work.",
    "videos.meta": "Stories from the field, in motion.",
    "videos.channel": "YouTube channel",

    /* Social */
    "social.eyebrow": "Social",
    "social.title": "Follow @asezglobal.",
    "social.meta": "Daily updates from chapters worldwide.",

    /* Footer */
    "footer.tagline": "Save the Earth from A to Z.",
    "footer.mission":
      "A global network of university student volunteers working to leave a more livable Earth for the next generation.",
    "footer.col.about": "About",
    "footer.col.what-we-do": "What we do",
    "footer.col.get-involved": "Get involved",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.desc": "Field stories and reports — once a month.",
    "footer.newsletter.placeholder": "your@email.com",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",

    "link.who-we-are": "Who we are",
    "link.our-story": "Our story",
    "link.save-movement": "S.A.V.E movement",
    "link.awards": "Awards",
    "link.partners": "Partners",
    "link.climate": "Climate action",
    "link.plastic": "Plastic-free world",
    "link.crime": "Crime prevention",
    "link.digital": "Digital human rights",
    "link.disaster": "Disaster relief",
    "link.join": "Join ASEZ",
    "link.start-chapter": "Start a chapter",
    "link.volunteer": "Volunteer",
    "link.partner": "Partner with us",
    "link.events": "Upcoming events",

    /* Common */
    "common.coming-soon": "Coming soon",
    "common.back-home": "Back to home",
    "common.read-more": "Read more",
    "common.all-stories": "All stories",
  },

  ko: {
    /* Nav */
    "nav.about": "소개",
    "nav.what-we-do": "활동",
    "nav.where-we-work": "활동 지역",
    "nav.stories": "소식",
    "nav.reports": "보고서",
    "nav.get-involved": "참여하기",

    /* Hero */
    "hero.eyebrow": "행복한 세상을 위해 A부터 Z까지",
    "hero.title.line1": "세상을 바꾸는",
    "hero.title.line2": "대학생들의 이야기.",
    "hero.lead":
      "전 세계 175개국 7,500여 캠퍼스에서 활동하는 대학생 봉사 단체 — 환경 보호, 지역사회 지원, 그리고 다음 세대를 위한 더 살기 좋은 지구를 만들어 갑니다.",
    "hero.cta.primary": "ASEZ 참여하기",
    "hero.cta.secondary": "활동 보기",

    /* Catchphrase */
    "catchphrase.eyebrow": "우리가 만들어가는 변화",
    "catchphrase.line":
      "대학생들의 에너지로 만드는 <strong>더 안전한 거리</strong>, <strong>더 푸른 도시</strong>, <strong>더 강한 공동체</strong>, <strong>더 빠른 재해 대응</strong> — 175개국에서, 매일.",

    /* Stats */
    "stats.eyebrow": "우리의 글로벌 네트워크",
    "stats.title": "숫자로 보는 ASEZ.",
    "stats.countries": "개국",
    "stats.campuses": "캠퍼스",
    "stats.hours": "자원봉사 시간",
    "stats.sdgs": "UN SDGs 기여",

    /* Major projects */
    "projects.eyebrow": "주요 활동",
    "projects.title": "ASEZ의 4가지 핵심 활동.",
    "projects.intro":
      "ASEZ의 모든 활동은 우리 세대가 직면한 4가지 시급한 과제를 중심으로 조직됩니다.",
    "projects.all": "전체 활동",
    "projects.learn-more": "자세히 보기",
    "projects.crime.title": "범죄 예방",
    "projects.crime.tagline": "우리는 안전한 세상을 만들어 갑니다.",
    "projects.crime.desc":
      "Reduce Crime Together — '깨진 유리창 이론'으로 더 안전한 거리, 학교, 캠퍼스를 만들어 갑니다.",
    "projects.climate.title": "기후변화 대응",
    "projects.climate.tagline": "우리는 지속가능한 세상을 만들어 갑니다.",
    "projects.climate.desc":
      "Blue Carbon, 나무 심기, Zero Plastic 2040, UN 기후 포럼 정책 참여.",
    "projects.community.title": "지역사회 봉사",
    "projects.community.tagline": "우리는 포용력 있는 세상을 만들어 갑니다.",
    "projects.community.desc":
      "이웃, 학교, 지역 NGO와 함께하는 봉사 — 가장 가까운 이웃부터 돌봅니다.",
    "projects.emergency.title": "재해 구호",
    "projects.emergency.tagline": "우리는 회복력 있는 세상을 만들어 갑니다.",
    "projects.emergency.desc":
      "지진, 홍수, 태풍, 분쟁 지역에서의 신속한 대응과 장기 복구 활동.",

    /* Activity by region */
    "region.eyebrow": "지역별 활동",
    "region.title": "지역 활동, 글로벌 무브먼트.",
    "region.intro":
      "ASEZ는 전 세계 5개 지역에서 활동합니다. 각 대륙에서 진행 중인 활동을 한눈에 살펴보세요.",
    "region.full-map": "지도 보기",
    "region.countries": "개국",
    "region.asia": "아시아",
    "region.americas": "아메리카",
    "region.europe": "유럽",
    "region.africa": "아프리카",
    "region.oceania": "오세아니아",

    /* Recognition */
    "recognition.eyebrow": "수상 및 협력",
    "recognition.title": "세계가 인정한 신뢰.",
    "recognition.see-all": "전체 보기",
    "recognition.awards.num": "12+",
    "recognition.awards.label": "국제 수상",
    "recognition.awards.sub":
      "UNCCD, 미국 대통령상, Green Apple Awards 등.",
    "recognition.partnerships.num": "80+",
    "recognition.partnerships.label": "협력 및 MOU",
    "recognition.partnerships.sub":
      "UN 기관, 정부, 대학, 글로벌 NGO와 협력.",

    /* Stories on home */
    "stories.eyebrow": "필드 스토리",
    "stories.title": "현장의 목소리.",
    "stories.view-all": "전체 소식",

    /* Video */
    "videos.eyebrow": "영상",
    "videos.title": "ASEZ의 활동.",
    "videos.meta": "현장에서 보내온 이야기.",
    "videos.channel": "YouTube 채널",

    /* Social */
    "social.eyebrow": "소셜",
    "social.title": "@asezglobal 팔로우.",
    "social.meta": "전 세계 챕터의 일상 업데이트.",

    /* Footer */
    "footer.tagline": "행복한 세상을 위해 A부터 Z까지.",
    "footer.mission":
      "다음 세대를 위한 더 살기 좋은 지구를 만들어가는 글로벌 대학생 봉사단 네트워크.",
    "footer.col.about": "소개",
    "footer.col.what-we-do": "활동",
    "footer.col.get-involved": "참여하기",
    "footer.newsletter": "뉴스레터",
    "footer.newsletter.desc": "현장 소식과 보고서 — 매월 발송.",
    "footer.newsletter.placeholder": "이메일 주소",
    "footer.rights": "모든 권리 보유.",
    "footer.privacy": "개인정보처리방침",
    "footer.terms": "이용약관",
    "footer.contact": "문의",

    "link.who-we-are": "우리는 누구인가",
    "link.our-story": "우리의 이야기",
    "link.save-movement": "S.A.V.E 운동",
    "link.awards": "수상 내역",
    "link.partners": "파트너",
    "link.climate": "기후변화 대응",
    "link.plastic": "플라스틱 프리 세상",
    "link.crime": "범죄 예방",
    "link.digital": "디지털 인권",
    "link.disaster": "재해 구호",
    "link.join": "ASEZ 가입",
    "link.start-chapter": "챕터 만들기",
    "link.volunteer": "자원봉사",
    "link.partner": "협력 제안",
    "link.events": "예정된 행사",

    /* Common */
    "common.coming-soon": "준비 중",
    "common.back-home": "홈으로 돌아가기",
    "common.read-more": "더 보기",
    "common.all-stories": "전체 소식",
  },
} as const;

export type UIKey = keyof typeof ui.en;
