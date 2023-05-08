// src/e2e-tests/app.spec.ts
import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium' });
test.use({ browserName: 'firefox' });
test.use({ browserName: 'webkit' });

test('loads app and displays Plantings Data', async ({ page }) => {
  await page.goto('http://localhost:5173'); // Update the port here

  const plantingsData = await page.$('text=Plantings Data');
  expect(plantingsData).toBeTruthy();
});
