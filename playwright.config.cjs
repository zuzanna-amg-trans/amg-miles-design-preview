if (process.env.GITHUB_ACTIONS !== 'true') {
  throw new Error('Run browser tests in GitHub Actions: open a pull request or use Run workflow. This keeps browser downloads and test output off the Mac.');
}

const { defineConfig } = require('@playwright/test');

const siteURL = process.env.PREVIEW_URL || 'http://127.0.0.1:4318/';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: true,
  workers: 1,
  retries: 0,
  maxFailures: 3,
  timeout: 30_000,
  globalTimeout: 240_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: new URL('design-preview/', siteURL).href,
    browserName: 'chromium',
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.PREVIEW_URL ? undefined : {
    command: 'python3 -m http.server 4318 --bind 127.0.0.1 --directory _site',
    url: 'http://127.0.0.1:4318/',
    reuseExistingServer: false,
    timeout: 15_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
  },
});
