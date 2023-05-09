// path: src/e2e-tests/playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'src/e2e-tests',
  timeout: 15000,
  projects: [
    {
      name: 'Chromium Desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Chromium Mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'Firefox Desktop',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Firefox Mobile',
      use: {
        browserName: 'firefox',
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
      },
    },
  ],
};

export default config;
