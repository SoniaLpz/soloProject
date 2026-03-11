import {test, expect} from '@playwright/test';

test("Adopter Login", async ({page}) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', "test125@gmail.com");
  await page.fill('input[name="password"]', "adopter");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});

test('Shelter Login', async ({page}) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', "test124@gmail.com");
  await page.fill('input[name="password"]', "adopter");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});