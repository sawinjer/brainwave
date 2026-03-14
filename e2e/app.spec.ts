import { test, expect } from "@playwright/test";

test.describe("Brainwave App", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Brainwave/i)).toBeVisible();
  });

  test("navigation works correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
