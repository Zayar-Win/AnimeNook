import { test, expect } from "@playwright/test";
import {
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    groupPath,
    loginGroupTenant,
    navigateGroup,
} from "./helpers";

test.describe("Group login", () => {
    test("user can log in and see session in the navbar", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`));
        await expect(
            page.locator('img[src*="sb.kaleidousercontent"]').first(),
        ).toBeVisible();
    });

    test("wrong password shows validation message", async ({ page }) => {
        await navigateGroup(page, "/login");
        await page.locator("#email").fill(E2E_USER_EMAIL);
        await page.locator("#password").fill("definitely-not-the-password");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page.getByText("Password doesn't match")).toBeVisible({
            timeout: 15_000,
        });
    });

    test("unknown email shows validation message", async ({ page }) => {
        await navigateGroup(page, "/login");
        await page.locator("#email").fill("no-such-user-e2e@example.test");
        await page.locator("#password").fill("password123");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(
            page.getByText(/selected email is invalid/i),
        ).toBeVisible({ timeout: 15_000 });
    });
});
