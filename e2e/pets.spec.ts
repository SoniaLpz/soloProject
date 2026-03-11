import {test, expect} from '@playwright/test';
// ({ page }) - fixture object provided by Playwright that represents a browser page. 
// We destructure it and use the property we need - in this case page.

//fixtures object looks like this:
//{
// page: Page - browser tab/page
// context: BrowserContext - browser session (cookies, storage)
// browser: Browser - actual browser instance 
//}

test("User can browse pet list", async ({page}) => {
  await page.goto('/pets'); //navigates to pets page
  await expect(page.locator('.pet-card').first()).toBeVisible(); // find all pet-cards, select the first, verify it's on screen
});

test("User can open pet details", async ({page}) => {
  await page.goto('/pets'); // navigates to pets page
  await page.locator('.pet-card').first().click(); // find all pet-cards, select the first, click on it to open the pet details
  await expect(page.locator("#name")).toBeVisible(); //verify it's on the pet details page
});

