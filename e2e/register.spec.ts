import {test, expect} from '@playwright/test';

test("User can register as an adopter", async ({page}) => {

  await page.goto('/register');

  const email = `adopter${Date.now()}@gmail.com`;

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "adopter");
  await page.selectOption('select[name="role"]', "adopter");
  await page.click('button[type="submit"]');
  await expect(page.getByText(/Registration successful! You can now log in./i)).toBeVisible();
});

test("User can register as a shelter", async ({page}) => {

  await page.goto('/register');

  const email = `shelter${Date.now()}@gmail.com`;
  
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "shelter");
  await page.selectOption('select[name="role"]', "shelter");
  await page.click('button[type="submit"]');
  await expect(page.getByText(/Registration successful! You can now log in./i)).toBeVisible();
});