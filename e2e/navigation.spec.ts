import { test, expect } from '@playwright/test';

test.describe('라우팅 및 네비게이션', () => {

  test('존재하지 않는 경로 접속 시 404 페이지가 표시된다', async ({ page }) => {
    await page.goto('/asdfjkl-not-exist');

    // NotFoundPage의 핵심 텍스트 확인
    await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없습니다' })).toBeVisible();
    await expect(page.getByText('홈으로 돌아가기')).toBeVisible();
  });

  test('404 페이지에서 "홈으로 돌아가기" 클릭 시 랜딩페이지로 이동한다', async ({ page }) => {
    await page.goto('/asdfjkl-not-exist');
    await page.getByText('홈으로 돌아가기').click();
    await page.waitForURL('**/');
    // 랜딩페이지의 히어로 텍스트 확인
    await expect(page.locator('h1')).toContainText('구슬로 시각화');
  });

  test('비로그인 상태로 /app 접속 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/app');
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('비로그인 상태로 /collection 접속 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/collection');
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('비로그인 상태로 /settings 접속 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });
});

test.describe('공개 페이지 접근', () => {

  test('서비스 소개 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/about-us');
    await expect(page.getByText('서비스 소개')).toBeVisible();
    await expect(page.getByText('하루마블(Haru Marble)')).toBeVisible();
  });

  test('개인정보처리방침 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: '개인정보처리방침' })).toBeVisible();
    await expect(page.getByText('개인정보의 수집 및 이용 목적')).toBeVisible();
  });

  test('문의하기 페이지가 정상 로드된다', async ({ page }) => {
    await page.goto('/contact-us');
    await expect(page.getByText('문의하기')).toBeVisible();
    await expect(page.getByText('문의 보내기')).toBeVisible();
  });

  test('로그인 페이지 폼이 올바르게 렌더링된다', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('안녕하세요!')).toBeVisible();
    await expect(page.getByPlaceholder('hello@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByText('로그인하기')).toBeVisible();
    // 소셜 로그인 버튼
    await expect(page.getByText('카카오로 시작하기')).toBeVisible();
    await expect(page.getByText('Google로 시작하기')).toBeVisible();
  });

  test('회원가입 페이지 폼이 올바르게 렌더링된다', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('환영합니다!')).toBeVisible();
    await expect(page.getByText('가입하기')).toBeVisible();
  });

  test('로그인 페이지에서 홈 로고 클릭 시 랜딩페이지로 이동한다', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('하루마블').first().click();
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('구슬로 시각화');
  });
});
