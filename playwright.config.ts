import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 모바일 (Galaxy S23+ 기준: 393x851)
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 393, height: 851 },
      },
    },

    // 데스크탑
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
