import { test, expect } from "@playwright/test";
import { E2E_GROUP } from "./helpers";

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

    test("main-domain /forgot-password redirects to group forgot-password (custom UI)", async ({
        page,
    }) => {
        const res = await page.goto("/forgot-password", {
            waitUntil: "domcontentloaded",
        });
        expect(res?.ok()).toBeTruthy();
        await expect(page).toHaveURL(
            new RegExp(`/${E2E_GROUP}/forgot-password$`),
            { timeout: 15_000 },
        );
        await expect(
            page.getByRole("heading", { name: /forgot password/i }),
        ).toBeVisible();
    });

    test("main-domain /login redirects to default group login (custom auth)", async ({
        page,
    }) => {
        const res = await page.goto("/login", { waitUntil: "domcontentloaded" });
        expect(res?.ok()).toBeTruthy();
        await expect(page).toHaveURL(
            new RegExp(`/${E2E_GROUP}/login$`),
            { timeout: 15_000 },
        );
        await expect(page.locator("#app")).toBeVisible();
    });

    test("main-domain /register redirects to default group register", async ({
        page,
    }) => {
        const res = await page.goto("/register", { waitUntil: "domcontentloaded" });
        expect(res?.ok()).toBeTruthy();
        await expect(page).toHaveURL(
            new RegExp(`/${E2E_GROUP}/register$`),
            { timeout: 15_000 },
        );
        await expect(page.locator("#app")).toBeVisible();
    });

    test("main-domain /profile redirects guest toward group login", async ({
        page,
    }) => {
        await page.goto("/profile", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(
            new RegExp(`/${E2E_GROUP}/login$`),
            { timeout: 15_000 },
        );
    });
});
