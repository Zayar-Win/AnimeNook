import { test, expect } from "@playwright/test";

test.describe("Platform pages (guest)", () => {
    test("about page loads", async ({ page }) => {
        const res = await page.goto("/about");
        expect(res?.ok()).toBeTruthy();
        await expect(page.locator("#app")).toBeVisible();
    });

    test("privacy and policy page loads", async ({ page }) => {
        const res = await page.goto("/privacy-and-policy");
        expect(res?.ok()).toBeTruthy();
        await expect(page.locator("#app")).toBeVisible();
    });

    test("contact page loads", async ({ page }) => {
        const res = await page.goto("/contact-us");
        expect(res?.ok()).toBeTruthy();
        await expect(page.locator("#app")).toBeVisible();
    });

    test("forgot password page loads (main Breeze route)", async ({ page }) => {
        const res = await page.goto("/forgot-password");
        expect(res?.ok()).toBeTruthy();
        await expect(page.locator("#app")).toBeVisible();
    });
});
