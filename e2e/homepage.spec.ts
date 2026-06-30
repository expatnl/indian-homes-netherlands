import { test, expect } from "@playwright/test";

test("homepage loads successfully in a real browser", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /IndianHomes\.nl/i })
  ).toBeVisible();
});
