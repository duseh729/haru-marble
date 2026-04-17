# 하루마블 (Haru Marble) — 서비스 컨텍스트

> 새로운 AI 세션을 시작할 때 "SERVICE_CONTEXT.md를 읽어줘"라고 하면  
> 지금까지의 맥락을 빠르게 전달할 수 있습니다.

---

## 서비스 개요

- **서비스명:** 하루마블 (Haru Marble)
- **URL:** https://haru-marble.com/
- **배포:** Vercel
- **개발자:** 안도연 (dev.ahndy@gmail.com)
- **언어:** 한국어 (한국 사용자 대상)

### 핵심 컨셉
할 일을 완료할 때마다 **유리병에 구슬이 쌓이는** 시각적 성취 기록 앱.
체크리스트를 "지우는" 것에서 벗어나, Matter.js 물리 엔진 기반의 구슬 애니메이션으로
성취감을 시각적으로 극대화하는 것이 목표.

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Vite + React + TypeScript |
| 스타일링 | Tailwind CSS v4 (`@import "tailwindcss"`) |
| 물리 엔진 | Matter.js |
| 백엔드/DB | Supabase (인증 + DB) |
| 배포 | Vercel |
| 이메일 | EmailJS |
| 분석 | Google Analytics (G-ELY1T7W11Y) |
| 폰트 | Pretendard (CDN) |

---

## 프로젝트 구조

```
c:\develop\done-list\
├── index.html              # 엔트리 포인트 (SEO 메타태그, GA 스크립트 등)
├── vercel.json             # 배포 설정 (CSP 헤더, SPA rewrites)
├── public/
│   ├── ads.txt             # AdSense: google.com, pub-6595346866756864, DIRECT, f08c47fec0942fa0
│   ├── sitemap.xml         # 사이트맵
│   ├── robots.txt          # 크롤러 설정 (/app, /collection, /settings 차단)
│   └── og-image-v2.png     # OG 이미지 (1200x630)
└── src/
    ├── App.tsx             # 라우팅 (BrowserRouter)
    ├── pages/
    │   ├── LandingPage.tsx      # / (랜딩, 인터랙티브 구슬 데모 포함)
    │   ├── AppPage.tsx          # /app (핵심 앱, 로그인 필요)
    │   ├── CollectionPage.tsx   # /collection (구슬 컬렉션, 로그인 필요)
    │   ├── SettingsPage.tsx     # /settings (로그인 필요)
    │   ├── LoginPage.tsx        # /login
    │   ├── RegisterPage.tsx     # /register
    │   ├── AboutUsPage.tsx      # /about-us
    │   ├── PrivacyPolicyPage.tsx # /privacy
    │   ├── ContactUsPage.tsx    # /contact-us (EmailJS 연동)
    │   ├── AuthCallbackPage.tsx # /auth/callback (Supabase OAuth)
    │   └── NotFoundPage.tsx     # 404
    └── components/
        ├── PhysicsJar.tsx       # Matter.js 물리 구슬 엔진
        ├── GlassJar.tsx         # 유리병 UI 컴포넌트
        └── MobileLayout.tsx     # 모바일 레이아웃 래퍼
```

---

## 라우팅 규칙

- **공개 (로그인 불필요):** `/`, `/login`, `/register`, `/about-us`, `/privacy`, `/contact-us`, `/auth/callback`
- **보호됨 (로그인 필요):** `/app`, `/collection`, `/settings`
- `robots.txt`에서 `/app`, `/collection`, `/settings`, `/auth/callback` 크롤러 차단

---

## 인증

- Supabase Auth (이메일/소셜 로그인)
- OAuth 콜백: `/auth/callback`
- `authApi.isAuthenticated()` — 세션 확인 유틸

---

## AdSense 현황

- **Publisher ID:** `pub-6595346866756864`
- **ads.txt:** `public/ads.txt`에 존재 ✅
- **index.html AdSense 스크립트:** 미삽입 ❌ (추가 필요)
- **CSP:** `vercel.json`에서 관리. AdSense 도메인 미포함 (추가 필요)

### AdSense 승인을 위해 필요한 것
1. `index.html`에 `pagead2.googlesyndication.com` 스크립트 추가
2. `vercel.json` CSP에 AdSense 관련 도메인 추가
3. `/guide` 가이드 페이지 추가 (콘텐츠 확장 목적)
4. 랜딩 페이지 콘텐츠 양 확대

---

## CSP 현황 (vercel.json)

현재 허용된 출처:
- `script-src`: self, unsafe-inline, googletagmanager.com
- `style-src`: self, unsafe-inline, cdn.jsdelivr.net
- `img-src`: self, data:, supabase.co, google-analytics.com, googletagmanager.com
- `connect-src`: self, supabase.co (ws 포함), google-analytics, googletagmanager, cdn.jsdelivr.net, emailjs.com
- `font-src`: self, cdn.jsdelivr.net

---

## 환경변수 (.env)

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

---

## 주요 개발 이력 (최근)

| 날짜 | 작업 |
|------|------|
| 2026-04-15 | 구슬 색상 동기화 버그 수정 (PhysicsJar ID 재조정) |
| 2026-04-15 | OG 이미지 업데이트 (`og-image-v2.png`) |
| 2026-04-15 | CSP 정책 수정 (Supabase WebSocket 허용) |
| 2026-04-15 | Supabase `user_metadata`로 마지막 bottle 상태 영속화 |
| 2026-04-17 | AdSense 승인 분석 시작, `/guide` 페이지 계획 |

---

## 현재 진행 중인 작업

- `/guide` 및 `/guide/:slug` 가이드 페이지 추가 (AdSense 콘텐츠 강화)
- AdSense 스크립트 삽입 및 CSP 업데이트
- 사이트맵 업데이트 (가이드 URL 추가)
