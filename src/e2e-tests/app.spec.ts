// src/e2e-tests/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Test across all platforms and browsers', () => {
  test('loads app and displays Plantings Data', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Update the port here

    const plantingsData = await page.$('text=Plantings Data');
    expect(plantingsData).toBeTruthy();
  });
});
