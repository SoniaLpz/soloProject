import {test, expect} from "@playwright/test";

test("Homepage loads", async ({page}) => {
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();
});

test('User can navigate to login page', async ({page}) => {
  await page.goto('/');

  await page.getByRole("link", {name: /Login/i}).click();
  await expect(page).toHaveURL('/login');
});

test("User can navigate to browse pets", async ({page}) => {
  await page.goto('/');

  await page.getByRole("link", {name: /View Pets/i}).click();
  await expect(page).toHaveURL('/pets');

});

test('User can navigate to sign up as shelter', async ({page}) => {
  await page.goto('/');

  await page.getByRole("link", {name: /Register as Shelter/i}).click();
  await expect(page).toHaveURL('/register');

});

test('User can click on contact', async ({page}) => {
  await page.goto('/');

  await page.getByRole("link", {name: /Contact Us/i}).click();
  await expect(page).toHaveURL('/contact');

});