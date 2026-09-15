import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4173/roskapstroy-pwa/', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1', port: 4173, reuseExistingServer: true },
  projects: [{ name: 'Mobile Safari', use: { ...devices['iPhone 15 Pro'] } }, { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } }]
});
