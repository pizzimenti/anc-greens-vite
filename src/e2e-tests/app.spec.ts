//path: src/e2e-tests/app.spec.ts

import { test, expect, chromium } from '@playwright/test';
import { format } from 'date-fns';

test.use({ browserName: 'chromium' });

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
          // Check if the cell has the 'highlighted' class
          const cellClass = await cells[j].getAttribute('class');
          expect(cellClass).toContain('highlighted');

          const cellStyle = await cells[j].evaluate((node) => getComputedStyle(node));
          console.log(`Animation: ${cellStyle.animation}, Animation Name: ${cellStyle.animationName}`);
          expect(cellStyle.animationName).toEqual('glow');
          
          const variety = await cells[1].innerText();
          await page.evaluate((variety) => console.log(`The variety of the first row with today's date is: ${variety}`), variety);

          // Check if there are any overlapping elements with a higher z-index
          const overlappingElement = await page.evaluate((cell) => {
            const rect = cell.getBoundingClientRect();
            const elementAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            return elementAtPoint !== cell && getComputedStyle(elementAtPoint).zIndex > getComputedStyle(cell).zIndex;
          }, cells[j]);
          console.log(`Overlapping element with higher z-index: ${overlappingElement}`);
          expect(overlappingElement).toBeFalsy();

          // Check if there are any overriding CSS rules
          const overridingRule = await page.evaluate((cell) => {
            const rules = Array.from(document.styleSheets)
              .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
              .filter((rule) => rule instanceof CSSStyleRule)
              .map((rule) => rule as CSSStyleRule)
              .filter((rule) => cell.matches(rule.selectorText));
            return rules.some((rule) => rule.style.getPropertyPriority('animation') === 'important' || rule.style.getPropertyPriority('box-shadow') === 'important');
          }, cells[j]);
          console.log(`Overriding CSS rule: ${overridingRule}`);
          expect(overridingRule).toBeFalsy();

          return;
        }
      }
    }

    // If we get here, it means no cells contained today's date
    throw new Error('No cell contained today\'s date');
  });
});
