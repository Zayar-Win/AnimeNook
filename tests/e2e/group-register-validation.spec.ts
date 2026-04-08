import { expect, test } from "@playwright/test";
import { navigateGroup } from "./helpers";

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
});
