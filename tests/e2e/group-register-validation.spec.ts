import { expect, test } from "@playwright/test";
import { E2E_USER_EMAIL, navigateGroup } from "./helpers";

test.describe("Group register validation", () => {
    test("invalid email shows validation error", async ({ page }) => {
        await navigateGroup(page, "/register");
        await page.locator("#name").fill("E2E Invalid Email");
        await page.locator("#email").fill("not-a-valid-email");
        await page.locator("#password").fill("password");
        await page.getByRole("button", { name: "Register" }).click();
        await expect(
            page.getByText(/must be a valid email address/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("duplicate email shows validation error (matches RegisterRequest unique rule)", async ({
        page,
    }) => {
        await navigateGroup(page, "/register");
        await page.locator("#name").fill("E2E Duplicate Email");
        await page.locator("#email").fill(E2E_USER_EMAIL);
        await page.locator("#password").fill("password");
        await page.getByRole("button", { name: "Register" }).click();
        await expect(
            page.getByText(/already been taken|already registered/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("password shorter than 6 characters shows validation error", async ({
        page,
    }) => {
        await navigateGroup(page, "/register");
        await page.locator("#name").fill("E2E Short Password");
        await page.locator("#email").fill(`short-password-${Date.now()}@example.test`);
        await page.locator("#password").fill("12345");
        await page.getByRole("button", { name: "Register" }).click();
        await expect(
            page.getByText(/must be at least 6 characters/i),
        ).toBeVisible({ timeout: 15_000 });
    });
});
