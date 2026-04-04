# Haru Marble E2E 테스트 가이드 (Playwright)

하루마블 프로젝트의 안정적인 사용자 경험과 크로스 브라우징 호환성을 보장하기 위해 Playwright를 이용한 E2E(End-to-End) 테스트가 도입되었습니다.

## 1. 테스트 목적
- **크로스 브라우징 검증**: Chromium, Firefox, **WebKit(Safari)** 환경에서 UI가 정상적으로 렌더링되는지 확인합니다. (특히 Safari에서의 PhysicsJar 캔버스 렌더링 버그 방지)
- **핵심 기능 검증**: 비로그인 사용자의 랜딩 페이지 체험, 페이지 전환, 리다이렉트 로직이 의도대로 동작하는지 확인합니다.
- **SEO 및 메타 정보**: 검색 엔진 최적화에 필요한 메타 태그와 타이틀이 올바르게 설정되었는지 확인합니다.

---

## 2. 주요 테스트 시나리오

### 🚀 랜딩 페이지 (`e2e/landing.spec.ts`)
- **캔버스 렌더링 (핵심)**: Matter.js 물리 엔진이 적용된 `<canvas>` 요소가 정상적으로 생성되고 너비/높이가 0이 아닌지 확인합니다.
- **데모 인터랙션**: 완료한 일을 입력하고 추가했을 때, 캔버스의 픽셀 변화를 감지하여 실제로 구슬이 떨어지는지 검증합니다.
- **상태 업데이트**: 구슬이 추가될 때마다 "N개의 구슬을 모았어요!" 텍스트가 실시간으로 갱신되는지 확인합니다.
- **SEO 검증**: 페이지 타이틀, Description, Open Graph 태그가 올바르게 설정되었는지 확인합니다.

### 🗺️ 라우팅 및 네비게이션 (`e2e/navigation.spec.ts`)
- **404 페이지**: 존재하지 않는 주소로 접근 시 `NotFoundPage`가 표시되고, 홈으로 돌아가기 버튼이 작동하는지 확인합니다.
- **보호된 라우트**: 로그인을 하지 않은 상태에서 `/app`, `/settings`, `/collection` 접근 시 `/login` 페이지로 자동 리다이렉트되는지 확인합니다.
- **공개 페이지**: 서비스 소개, 개인정보처리방침, 문의하기, 로그인, 회원가입 페이지가 정상적으로 로드되는지 확인합니다.

---

## 3. 테스트 실행 환경

모든 테스트는 다음 환경에서 실행됩니다:
- **모바일**: **Samsung Galaxy S23+** (393x851) 뷰포트 기준
- **데스크탑**: 기본 데스크탑 브라우저 크기 기준
- **브라우저 엔진**: Chromium, Firefox, WebKit (총 6개 프로젝트)

---

## 4. 테스트 실행 명령어

프로젝트 루트 디렉토리에서 다음 명령어를 사용하세요.

### 전체 테스트 실행 (권장)
모든 브라우저와 뷰포트에서 102개의 테스트를 한 번에 실행합니다.
```bash
yarn test:e2e
```

### UI 모드로 실행 (디버깅용)
브라우저 화면을 직접 보면서 단계별 실행 과정과 타임라인을 확인할 수 있습니다.
```bash
yarn test:e2e:ui
```

### Safari(WebKit)만 실행
이전 버그가 있었던 WebKit 엔진 환경에서의 렌더링만 집중적으로 테스트합니다.
```bash
yarn test:e2e:webkit
```

### 결과 리포트 보기
테스트 완료 후 상세한 성공/실패 내역과 스크린샷이 담긴 HTML 리포트를 확인합니다.
```bash
npx playwright show-report
```

---

## 5. 테스트 작성 팁

새로운 페이지나 기능에 대해 테스트를 추가하고 싶다면 `e2e/` 디렉토리에 `.spec.ts` 파일을 생성하세요.

```typescript
import { test, expect } from '@playwright/test';

test('새로운 기능 테스트', async ({ page }) => {
  await page.goto('/new-feature');
  await expect(page.getByRole('heading', { name: '기능 제목' })).toBeVisible();
});
```

> [!TIP]
> 테스트 작성 시 `getByText` 대신 `getByRole`이나 `getByPlaceholder`를 사용하면 더 견고한 테스트를 작성할 수 있습니다. (Strict mode 위반 방지)
