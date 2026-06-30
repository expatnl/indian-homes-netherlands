import { test, expect } from "@playwright/test";

// These confirm the auth pages render in a real browser without crashing —
// including AuthProvider's Firebase client initialization, which runs with
// no real Firebase project configured in this environment. Full Google /
// email-password sign-in flows need a real Firebase project to verify
// end-to-end (see docs/CLOUD_SETUP.md) and are not exercised here.

test("register page renders both Google and email/password options", async ({ page }) => {
  const response = await page.goto("/account/register");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
});

test("login page renders both Google and email/password options", async ({ page }) => {
  const response = await page.goto("/account/login");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /forgot your password/i })).toBeVisible();
});

test("forgot-password page renders the reset form", async ({ page }) => {
  const response = await page.goto("/account/forgot-password");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
});

test("my-listings redirects an unauthenticated visitor to login", async ({ page }) => {
  await page.goto("/account/my-listings");
  await page.waitForURL("**/account/login");
  expect(new URL(page.url()).pathname).toBe("/account/login");
});
