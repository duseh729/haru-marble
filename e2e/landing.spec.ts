import { test, expect } from '@playwright/test';

test.describe('랜딩 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    // 히어로 텍스트가 보이는지 확인
    await expect(page.locator('h1')).toContainText('구슬로 시각화');
    // CTA 버튼 존재 확인
    await expect(page.getByText('무료로 시작하기').first()).toBeVisible();
  });

  test('PhysicsJar 캔버스가 렌더링된다 (크로스 브라우저 핵심)', async ({ page }) => {
    // Matter.js가 만드는 <canvas> 요소가 존재하는지 확인
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // 캔버스의 크기가 0이 아닌지 확인 (렌더링 실패 시 0x0이 됨)
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('데모 구슬을 추가하면 캔버스에 렌더링된다', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // 구슬 추가 전 캔버스 스크린샷
    const beforeScreenshot = await canvas.screenshot();

    // 데모 입력 후 구슬 추가
    const input = page.getByPlaceholder('완료한 일을 입력해보세요!');
    await input.fill('테스트 구슬');
    await input.press('Enter');

    // 구슬이 물리 엔진에 의해 떨어질 시간 대기
    await page.waitForTimeout(1500);

    // 구슬 추가 후 캔버스 스크린샷
    const afterScreenshot = await canvas.screenshot();

    // 전후 스크린샷이 다르면 렌더링이 발생한 것 (픽셀 단위 비교)
    expect(Buffer.compare(beforeScreenshot, afterScreenshot)).not.toBe(0);
  });

  test('구슬 카운트 텍스트가 업데이트된다', async ({ page }) => {
    // 초기 상태
    await expect(page.getByText('로그인 없이 바로 체험해보세요')).toBeVisible();

    // 구슬 추가
    const input = page.getByPlaceholder('완료한 일을 입력해보세요!');
    await input.fill('운동하기');
    await input.press('Enter');

    // 카운트 업데이트 확인
    await expect(page.getByText('1개의 구슬을 모았어요!')).toBeVisible();
  });

  test('"시작하기" 버튼 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
    // 네비게이션 바의 "시작하기" 버튼 클릭
    await page.getByText('시작하기 →').click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('SEO 메타 태그가 올바르게 설정되어 있다', async ({ page }) => {
    // title 확인
    await expect(page).toHaveTitle(/하루마블/);

    // description 메타 태그
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /구슬/);

    // OG 태그
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /하루마블/);
  });
});
