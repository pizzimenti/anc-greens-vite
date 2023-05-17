// path: src/e2e-tests/app.spec.ts

import { test, expect } from '@playwright/test';

// Test suite for the application
test.describe('Planting Tracker Application', () => {

  // This is the URL of the application under test
  const appURL = 'http://localhost:5173';

  // Test for successful page load
  test('Page Load', async ({ page }) => {
    // Navigate to the application URL
    await page.goto(appURL);

    // Check if the correct page title is displayed
    const title = page.locator('.header h2');
    await expect(title).toHaveText('Plantings Data');
  });

  // Test for data presentation
  test('Data Presentation', async ({ page }) => {
    // Navigate to the application URL
    await page.goto(appURL);

    // Check if the table headers are loaded and correct
    const headers = await page.$$eval('.plantings-table th', headers => headers.map(header => header.textContent));
    expect(headers).toEqual(["planting", "variety", "number", "seedsPerPlug", "seedDate", "seedAttributes", "actualSeedDate", "trayDate", "actualTrayDate", "t1Date", "t1Location", "t2Date", "t2Location", "t3Date", "t3Location", "harvestDate", "harvestNotes", "result"]);

    // Check if the table has data rows
    const rows = await page.$$('.plantings-table tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  // Test for date highlighting
  test('Date Highlighting', async ({ page }) => {
    // Navigate to the application URL
    await page.goto(appURL);

    // Find the highlighted rows
    const highlightedRows = await page.$$('.highlighted');

    // There may be no highlighted rows if none of the dates match today's date.
    // If there are highlighted rows, check that they contain today's date
    if (highlightedRows.length > 0) {
      const today = new Date().toISOString().slice(0, 10);  // today's date in YYYY-MM-DD format
      for (const row of highlightedRows) {
        const rowText = await row.textContent();
        expect(rowText).toContain(today);
      }
    }
  });
});
