import { expect, test } from "@playwright/test";
import { groupPath, navigateGroup } from "./helpers";

/**
 * Critical path on small viewports: hamburger drawer → navigation → login entry.
 * Uses `md:hidden` UI from the group navbar.
 */
test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
});

test.describe("Group mobile drawer (guest)", () => {
    test("open hamburger, navigate to Anime list, open Sign In", async ({
        page,
    }) => {
        await navigateGroup(page, "/");

        const mobileHeader = page.locator(".md\\:hidden.flex.items-center.gap-2");
        const hamburger = mobileHeader.locator("button").nth(1);
        await expect(hamburger).toBeVisible({ timeout: 15_000 });
        await hamburger.click();

        await expect(
            page.getByRole("link", { name: "Anime List" }),
        ).toBeVisible({ timeout: 15_000 });
        await page.getByRole("link", { name: "Anime List" }).click();
        await expect(page).toHaveURL(/\/animes$/);

        await hamburger.click();
        await page
            .getByRole("link", { name: "Sign In" })
            .first()
            .click();
        await expect(page).toHaveURL(new RegExp(`${groupPath("/login")}$`), {
            timeout: 15_000,
        });
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });
});
