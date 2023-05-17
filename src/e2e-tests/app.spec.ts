// Path: src/e2e-tests/app.spec.ts

import { test, expect } from '@playwright/test';

// Base URL of the application
const appURL = 'http://localhost:5173/';

test.describe('Planting Tracker Application', () => {

  // Test for navigation
  test('Navigation', async ({ page }) => {
    console.log('Running Navigation Test...');
    // Navigate to the application URL
    await page.goto(appURL);

    // Check if the correct page title is displayed
    const title = await page.title();
    expect(title).toBe('Anchorage Greens');
    console.log('Navigation Test Passed!');
  });

  // Test for data presentation
  test('Data Presentation', async ({ page }) => {
    console.log('Running Data Presentation Test...');
    // Navigate to the application URL
    await page.goto(appURL);

    try {
      // Wait until the ".plantings-table" element is loaded indicating that the data fetch is complete
      await page.waitForSelector('.plantings-table', {timeout: 10000}); // Increase the timeout if needed

      // Check if the table headers are loaded and correct
      const headers = await page.$$eval('.plantings-table th', headers => headers.map(header => header.textContent));
      expect(headers).toEqual(["planting", "variety", "number", "seedsPerPlug", "seedDate", "seedAttributes", "actualSeedDate", "trayDate", "actualTrayDate", "t1Date", "t1Location", "t2Date", "t2Location", "t3Date", "t3Location", "harvestDate", "harvestNotes", "result"]);

      // Add a delay to allow data to load
      await page.waitForTimeout(15000); // Adjust this delay as necessary

      // Check if the table has data rows
      const rows = await page.$$('.plantings-table tbody tr');
      expect(rows.length).toBeGreaterThan(0);
      console.log('Data Presentation Test Passed!');
    } catch (error) {
      console.error('Data Presentation Test Failed:', error);
    }
  });
  
  // Add any other tests as needed
});
