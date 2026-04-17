# Task: /guide 페이지 추가 + AdSense 설정 완성

## 1. 가이드 데이터
- [x] `src/data/guides.ts` 생성
  - [x] 5개 가이드 데이터 작성 (slug, title, description, readTime, sections[])
  - `getting-started` / `how-marbles-work` / `bottle-collection` / `tips-for-productivity` / `faq`
  - 각 가이드 본문 700단어 이상 한국어 텍스트

## 2. 가이드 목록 페이지
- [x] `src/pages/GuidePage.tsx` 생성
  - [x] 카드 리스트 형태로 가이드 목록 표시
  - [x] 카테고리 배지, 읽기 시간, 설명 포함
  - [x] 랜딩과 동일한 웹 레이아웃 (풀 화면, 네비게이션 + 푸터 포함)
  - [x] Helmet SEO 태그 (title, description)

## 3. 가이드 상세 페이지
- [x] `src/pages/GuideDetailPage.tsx` 생성
  - [x] `useParams()`로 slug 읽기
  - [x] slug가 없으면 NotFoundPage로 리다이렉트
  - [x] 섹션별 h2, 본문, 팁 박스 렌더링
  - [x] 뒤로가기 버튼 (`/guide`로)
  - [x] Helmet SEO 태그 (각 가이드별 title, description)

## 4. 라우팅 수정
- [x] `src/App.tsx` 수정
  - [x] `GuidePage` lazy import 추가
  - [x] `GuideDetailPage` lazy import 추가
  - [x] `/guide` 라우트 추가 (MobileLayout 밖)
  - [x] `/guide/:slug` 라우트 추가 (MobileLayout 밖)

## 5. SEO / 크롤러
- [x] `public/sitemap.xml` 수정
  - [x] `/guide` URL 추가
  - [x] `/guide/getting-started` 추가
  - [x] `/guide/how-marbles-work` 추가
  - [x] `/guide/bottle-collection` 추가
  - [x] `/guide/tips-for-productivity` 추가
  - [x] `/guide/faq` 추가

## 6. AdSense 완성
- [x] `index.html` 수정
  - [x] Auto Ads 스크립트 삽입 (`pub-6595346866756864`)
- [x] `vercel.json` 수정
  - [x] `script-src`에 `https://pagead2.googlesyndication.com` 추가
  - [x] `frame-src` 헤더에 `https://googleads.g.doubleclick.net` 추가
  - [x] `img-src`에 AdSense 이미지 도메인 추가

## 7. 검증
- [x] `yarn build` 빌드 성공 확인
- [x] `/guide` 목록 렌더 확인
- [x] `/guide/:slug` 각 페이지 확인
- [x] 없는 slug 진입 시 404 처리 확인
- [x] AdSense 스크립트 콘솔 오류 없음 확인
- [x] `SERVICE_CONTEXT.md` 가이드 관련 내용 업데이트
