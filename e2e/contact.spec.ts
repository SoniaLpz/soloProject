import {test, expect} from '@playwright/test';

test('User should be able to submit form', async ({page}) => {
  await page.goto('/contact');

  await page.fill('input[name="name"]', "John");
  await page.fill('input[name="email"]', "john@gmail.com");
  await page.fill('textarea[name="message"]', "I want to adopt Buddy");
  await page.click('button[type="submit"]');
  
  await expect(page.getByText(/Message sent successfully!/i)).toBeVisible();

});