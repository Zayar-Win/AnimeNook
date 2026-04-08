import { test, expect } from "@playwright/test";

test.describe("Platform blog", () => {
    test("blog home loads", async ({ page }) => {
        const res = await page.goto("/");
        expect(res?.ok()).toBeTruthy();
        await expect(page.locator(".blog-swiper")).toBeVisible();
    });
});
