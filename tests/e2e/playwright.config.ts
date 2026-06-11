import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'specs/**/*.spec.ts',
  outputDir: './results/artifacts',
  fullyParallel: true,
  forbidOnly: !!(process.env.CI || process.env.TF_BUILD),
  retries: (process.env.CI || process.env.TF_BUILD) ? 2 : 0,
  workers: (process.env.CI || process.env.TF_BUILD) ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'results/html', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npx next dev --port 3000',
    url: 'http://localhost:3000',
    cwd: '../../apps/web',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
