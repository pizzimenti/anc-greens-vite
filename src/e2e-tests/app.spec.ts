// path: src/e2e-tests/app.spec.ts
import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test.describe('Test across all platforms and browsers', () => {
  test('loads app and displays Plantings Data', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const plantingsData = await page.$('text=Plantings Data');
    expect(plantingsData).toBeTruthy();

    // Add a console log handler
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));

    const today = format(new Date(), 'EEE, M/d');  

    // Wait for the table to be present in the DOM
    await page.waitForSelector('table.plantings-table');

    const rows = await page.$$('table.plantings-table > tbody > tr');

    for (let i = 0; i < rows.length; i++) {
      const cells = await rows[i].$$('td');
      for (let j = 0; j < cells.length; j++) {
        const cellContent = await cells[j].innerText();
        if (cellContent.includes(today)) {
          const variety = await cells[1].innerText();
          await page.evaluate((variety) => console.log(`The variety of the first row with today's date is: ${variety}`), variety);
          return;
        }
      }
    }

    // If we get here, it means no cells contained today's date
    throw new Error('No cell contained today\'s date');
  });
});
